import test from 'node:test';
import assert from 'node:assert/strict';
import { core } from './load.js';

const C = core();
const ALL_BYTES = Array.from({ length: 256 }, (_, i) => i);
// 往復の確かめに使う文字列（ASCII 全部・日本語・絵文字・結合文字・ZWJ・国旗・空文字）
const SAMPLES = [
  String.fromCharCode(...Array.from({ length: 128 }, (_, i) => i)),
  'HELLO', 'Hello, World!', 'インボリューション', 'A😀B', 'é', '👨‍👩‍👧', '🇯🇵🇺🇸', ''
];

test('Atbash: 既知解答、大文字・小文字を保つ、英字以外はそのまま、26文字とも2回で戻り自分自身には移らない', () => {
  assert.equal(C.atbash('HELLO').output, 'SVOOL');
  assert.equal(C.atbash('Hello, World! 123').output, 'Svool, Dliow! 123');
  assert.deepEqual(C.atbash('Hello').used, ['E', 'H', 'L', 'O']);
  for (let c = 65; c <= 90; c++) {
    const ch = String.fromCharCode(c);
    assert.notEqual(C.atbash(ch).output, ch, ch);
    assert.equal(C.atbash(C.atbash(ch).output).output, ch, ch);
  }
  for (const s of SAMPLES) assert.equal(C.atbash(C.atbash(s).output).output, s);
});

test('ROT13・ROT47: 既知解答と、2回で戻ること', () => {
  assert.equal(C.rot13('Hello, World!'), 'Uryyb, Jbeyq!');
  assert.equal(C.rot47('Hello World!'), 'w6==@ (@C=5P');
  for (const s of SAMPLES) {
    assert.equal(C.rot13(C.rot13(s)), s);
    assert.equal(C.rot47(C.rot47(s)), s);
  }
  // ROT47 は 33〜126 の94文字すべてを別の文字へ移し、空白（32）と127は動かさない
  for (let c = 33; c <= 126; c++) assert.notEqual(C.rot47(String.fromCharCode(c)), String.fromCharCode(c));
  assert.equal(C.rot47(' \u007f'), ' \u007f');
});

test('文字反転・ペア交換はコードポイント単位で、途中の文字列も正しい Unicode のまま2回で戻る', () => {
  assert.equal(C.reverse('HELLO'), 'OLLEH');
  assert.equal(C.reverse('A😀B'), 'B😀A');
  assert.equal(C.swapPairs('ABCD').output, 'BADC');
  assert.deepEqual(C.swapPairs('ABCDE'), { output: 'BADCE', pairs: [['A', 'B'], ['C', 'D']], odd: 'E' });
  assert.equal(C.swapPairs('A😀B').output, '😀AB');
  for (const s of SAMPLES) {
    assert.ok(C.reverse(s).isWellFormed(), s);
    assert.ok(C.swapPairs(s).output.isWellFormed(), s);
    assert.equal(C.reverse(C.reverse(s)), s);
    assert.equal(C.swapPairs(C.swapPairs(s).output).output, s);
  }
});

test('行列の転置は、正方でなくても2回で元に戻る', () => {
  const m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  assert.deepEqual(C.transpose(m), [[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
  assert.ok(C.sameMatrix(C.transpose(C.transpose(m)), m));
  assert.ok(!C.sameMatrix(C.transpose(m), m));
  const r = [[1, 2, 3], [4, 5, 6]];
  assert.deepEqual(C.transpose(r), [[1, 4], [2, 5], [3, 6]]);
  assert.ok(C.sameMatrix(C.transpose(C.transpose(r)), r));
});

test('8ビットの NOT は256通りすべてで2回で戻り、自分自身にはならない', () => {
  for (const v of ALL_BYTES) {
    assert.equal(C.bitNot(C.bitNot(v)), v);
    assert.notEqual(C.bitNot(v), v);
  }
  assert.equal(C.bitNot(65), 190);
  assert.equal(C.toBinary(60, 8), '00111100');
  assert.equal(C.toBinary(C.bitNot(60), 8), '11000011');
});

test('ビット反転の入力: 文字は1文字で U+00FF まで、数値は 0〜255 の10進数だけ', () => {
  const ok = (value) => ({ ok: true, value });
  const ng = (error) => ({ ok: false, error });
  assert.deepEqual(C.parseByteInput('char', 'A'), ok(65));
  assert.deepEqual(C.parseByteInput('char', 'ÿ'), ok(255));
  assert.deepEqual(C.parseByteInput('char', ''), ng('empty'));
  assert.deepEqual(C.parseByteInput('char', 'AB'), ng('many'));
  assert.deepEqual(C.parseByteInput('char', 'あ'), ng('wide'));
  assert.deepEqual(C.parseByteInput('char', '😀'), ng('wide'));
  assert.deepEqual(C.parseByteInput('byte', '0'), ok(0));
  assert.deepEqual(C.parseByteInput('byte', ' 255 '), ok(255));
  for (const raw of ['256', '-1', '12abc', '1e2', '0x10', '1.5', '１２']) assert.deepEqual(C.parseByteInput('byte', raw), ng('range'), raw);
  assert.deepEqual(C.parseByteInput('byte', '  '), ng('empty'));
});

test('1バイトの表記: 印字できる文字はその文字、空白・制御文字・ソフトハイフンは U+00XX', () => {
  assert.equal(C.byteGlyph(65), 'A');
  assert.equal(C.byteGlyph(60), '<');
  assert.equal(C.byteGlyph(255), 'ÿ');
  for (const [v, label] of [[0, 'U+0000'], [32, 'U+0020'], [127, 'U+007F'], [160, 'U+00A0'], [173, 'U+00AD']]) assert.equal(C.byteGlyph(v), label);
});

test('0〜上限の整数の読み取り（0 を有効な値として扱う）', () => {
  assert.equal(C.parseIntIn('0', 255), 0);
  assert.equal(C.parseIntIn('15', 15), 15);
  for (const raw of ['', ' ', '16', '-1', '3.0', 'a']) assert.equal(C.parseIntIn(raw, 15), null, raw);
});

// Feistel の検算用に、別に書いた参照実装
const F = (r, k) => ((r + k) % 16) ^ (r >> 2);
function refRounds(L, R, keys) {
  for (const k of keys) [L, R] = [R, (L ^ F(R, k)) & 15];
  return [L, R];
}

test('Feistel: 暗号化 → 入れ替え → 鍵を逆順にして同じ回路 → 入れ替え、で256通りすべて元に戻る（鍵の組を変えても）', () => {
  const keySets = [C.FEISTEL_KEYS, [0, 0, 0, 0], [15, 15, 15, 15], [1, 2, 3], [7], [9, 4, 14, 1, 6, 11]];
  for (let i = 0; i < 40; i++) keySets.push(Array.from({ length: 4 }, (_, j) => (i * 7 + j * 5 + i * j) % 16));
  for (const keys of keySets) {
    for (const v of ALL_BYTES) {
      const { steps, cipher, plain } = C.feistelSteps(v, keys);
      assert.equal(plain, v, `${v} ${keys}`);
      assert.equal(steps.length, keys.length * 2 + 2);
      const [L, R] = refRounds(v >> 4, v & 15, keys);
      assert.equal(cipher, (L << 4) | R);
    }
  }
});

test('Feistel: 手順の中身（既定の鍵 5,3,12,9、入力170）', () => {
  const { steps, cipher, plain } = C.feistelSteps(170);
  assert.deepEqual(steps.map((s) => s.phase), ['enc', 'enc', 'enc', 'enc', 'swap', 'dec', 'dec', 'dec', 'dec', 'swap']);
  assert.deepEqual(steps.filter((s) => s.phase !== 'swap').map((s) => s.key), [5, 3, 12, 9, 9, 12, 3, 5]);
  const [L, R] = refRounds(10, 10, [5, 3, 12, 9]);
  assert.equal(cipher, (L << 4) | R);
  assert.equal(plain, 170);
  for (let i = 1; i < steps.length; i++) assert.deepEqual(steps[i].before, steps[i - 1].after, String(i));
});

test('Feistel: 入れ替えを除いた半ラウンドは、どの入力・鍵でも2回で戻る。同じ鍵で4ラウンドを続けても戻るのは4096通り中50通りだけ', () => {
  let back = 0;
  for (const v of ALL_BYTES) {
    for (let k = 0; k < 16; k++) {
      const once = C.feistelHalf(v >> 4, v & 15, k);
      assert.deepEqual(C.feistelHalf(once.L, once.R, k), { L: v >> 4, R: v & 15 });
      const [L, R] = refRounds(v >> 4, v & 15, [k, k, k, k]);
      if (((L << 4) | R) === v) back++;
    }
  }
  assert.equal(back, 50);
});
