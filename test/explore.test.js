import test from 'node:test';
import assert from 'node:assert/strict';
import { core } from './load.js';

const C = core();
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const chr = (...codes) => String.fromCharCode(...codes);

test('位数: シーザーは 26/gcd(k, 26) 回、ROT13・Atbash・反転・ペア交換は2回で元に戻る', () => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  for (let k = 1; k < 26; k++) assert.equal(C.orderOf(C.orderTransform('caesar', k), A).order, 26 / gcd(k, 26), String(k));
  for (const kind of ['rot13', 'atbash', 'reverse', 'pairs']) assert.equal(C.orderOf(C.orderTransform(kind), 'Hello, World').order, 2, kind);
  // 英字のない文字列は、シーザーでは1回で変わらない
  assert.equal(C.orderOf(C.orderTransform('caesar', 3), '123').order, 1);
  assert.equal(C.orderOf(C.orderTransform('caesar', 3), 'ABC').states.length, 27);
});

test('位数: パーフェクトシャッフル（アウト・イン）の回数は、別に書いた参照実装と同じ。52枚はアウト8回・イン52回', () => {
  const ref = (n, out) => {
    const start = [...Array(n).keys()];
    const once = (a) => a.slice(0, n / 2).flatMap((x, i) => (out ? [x, a[n / 2 + i]] : [a[n / 2 + i], x]));
    let a = once(start);
    let k = 1;
    while (a.join() !== start.join()) {
      a = once(a);
      k++;
    }
    return k;
  };
  assert.equal(C.shuffle('ABCD', true), 'ACBD');
  assert.equal(C.shuffle('ABCD', false), 'CADB');
  for (let n = 2; n <= 26; n += 2) {
    assert.equal(C.orderOf(C.orderTransform('outShuffle'), A.slice(0, n)).order, ref(n, true), `out ${n}`);
    assert.equal(C.orderOf(C.orderTransform('inShuffle'), A.slice(0, n)).order, ref(n, false), `in ${n}`);
  }
  assert.equal(C.orderOf(C.orderTransform('outShuffle'), A).order, 20);
  assert.equal(C.orderOf(C.orderTransform('inShuffle'), A).order, 18);
  assert.equal(ref(52, true), 8);
  assert.equal(ref(52, false), 52);
  assert.equal(C.orderInputError('outShuffle', 'ABC'), 'odd');
  assert.equal(C.orderInputError('reverse', ''), 'empty');
  assert.equal(C.orderInputError('reverse', 'ABC'), null);
});

test('換字表の読み取り: 26文字ちょうど・英字だけ・重複なし（足りない文字を返す）', () => {
  assert.deepEqual(C.parseAlphabet('zyxwvutsrqponmlkjihgfedcba'), { ok: true, map: [...Array(26).keys()].map((i) => 25 - i) });
  assert.deepEqual(C.parseAlphabet('ZYXW VUTS RQPO NMLK JIHG FEDC BA').ok, true);
  assert.deepEqual(C.parseAlphabet('ABC'), { ok: false, error: 'length', length: 3 });
  assert.deepEqual(C.parseAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXY1'), { ok: false, error: 'letters' });
  assert.deepEqual(C.parseAlphabet('AACDEFGHIJKLMNOPQRSTUVWXYZ'), { ok: false, error: 'duplicate', missing: ['B'] });
});

test('判定器のプリセット: UKW-B・Atbash・ROT13 は不動点のない対合、シーザー3は26回、ローターIは60回、Beaufort は鍵の文字で不動点が変わる', () => {
  const an = (key) => C.analyzePermutation(C.parseAlphabet(C.PRESETS[key]()).map);
  for (const key of ['ukwB', 'atbash', 'rot13', 'beaufortB']) {
    const r = an(key);
    assert.ok(r.involution, key);
    assert.deepEqual(r.fixed, [], key);
    assert.equal(r.pairs.length, 13, key);
    assert.equal(r.order, 2, key);
  }
  assert.deepEqual(an('beaufortA').fixed, ['A', 'N']);
  assert.equal(an('beaufortA').pairs.length, 12);
  assert.deepEqual([an('caesar3').involution, an('caesar3').order, an('caesar3').longer.length], [false, 26, 1]);
  const rotor = an('rotorI');
  assert.deepEqual([rotor.involution, rotor.order, rotor.fixed, rotor.longer.map((c) => c.length).sort((a, b) => b - a)], [false, 60, ['S'], [10, 4, 4, 3]]);
  assert.equal(C.PRESETS.ukwB(), 'YRUHQSLDPXNGOKMIEBFZCWVJAT');
  assert.equal(C.ROTOR_I, 'EKMFLGDQVZNTOWYHXUSPAIBRCJ');
  // Beaufort の鍵の文字が偶数番目なら2文字、奇数番目なら0文字が自分自身に移る
  for (let k = 0; k < 26; k++) {
    const alpha = [...A].map((_, p) => A[(((k - p) % 26) + 26) % 26]).join('');
    assert.equal(C.analyzePermutation(C.parseAlphabet(alpha).map).fixed.length, k % 2 ? 0 : 2, String(k));
  }
});

test('ランダムな対合は、いつも対合になる（不動点なしを選べば13組）', () => {
  let seed = 12345;
  const rand = (n) => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed % n;
  };
  for (let i = 0; i < 200; i++) {
    for (const free of [true, false]) {
      const parsed = C.parseAlphabet(C.randomInvolution(rand, free));
      assert.ok(parsed.ok);
      const r = C.analyzePermutation(parsed.map);
      assert.ok(r.involution);
      if (free) assert.deepEqual([r.fixed.length, r.pairs.length], [0, 13]);
    }
  }
});

test('対合の数: n=1〜10 は 1,2,4,10,26,76,232,764,2620,9496。26文字は532,985,208,200,576通り、不動点なしは7,905,853,580,625通り', () => {
  assert.deepEqual(Array.from({ length: 10 }, (_, i) => Number(C.involutionCount(i + 1))), [1, 2, 4, 10, 26, 76, 232, 764, 2620, 9496]);
  assert.equal(C.involutionCount(26), 532985208200576n);
  assert.equal(C.fixedPointFreeCount(26), 7905853580625n);
  assert.equal(C.fixedPointFreeCount(3), 0n);
  // 小さい n は全数え上げで確かめる
  const perms = (n) => (n === 0 ? [[]] : perms(n - 1).flatMap((p) => Array.from({ length: n }, (_, i) => [...p.slice(0, i), n - 1, ...p.slice(i)])));
  for (let n = 1; n <= 7; n++) {
    const all = perms(n);
    assert.equal(BigInt(all.filter((p) => p.every((v, i) => p[v] === i)).length), C.involutionCount(n), String(n));
    assert.equal(BigInt(all.filter((p) => p.every((v, i) => p[v] === i && v !== i)).length), C.fixedPointFreeCount(n), String(n));
  }
});

// エニグマの簡易版を、別に書いた参照実装で確かめる
const idx = (s) => [...s].map((c) => A.indexOf(c));
const R1 = idx('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
const UB = idx('YRUHQSLDPXNGOKMIEBFZCWVJAT');
const R1INV = [];
R1.forEach((v, i) => {
  R1INV[v] = i;
});
const refMap = (p) => [...Array(26).keys()].map((c) => {
  const x = UB[(R1[(c + p) % 26] - p + 26) % 26];
  return (R1INV[(x + p) % 26] - p + 26) % 26;
});

test('エニグマの簡易版: 26の位置すべてで不動点のない対合。同じ開始位置でもう一度通すと元に戻る', () => {
  for (let p = 0; p < 26; p++) {
    const m = C.enigmaMapAt(p);
    assert.deepEqual(m, refMap(p), String(p));
    const r = C.analyzePermutation(m);
    assert.ok(r.involution && r.fixed.length === 0 && r.pairs.length === 13, String(p));
  }
  assert.equal(C.enigma('HELLOWORLD', 0).output, 'FJGANRHBSE');
  for (const start of [0, 7, 25]) {
    for (const text of ['HELLOWORLD', 'Hello, World!', 'ATTACK AT DAWN', 'あいう 123']) {
      const once = C.enigma(text, start).output;
      assert.equal(C.enigma(once, start).output, text, `${start} ${text}`);
      [...text].forEach((ch, i) => {
        if (/[A-Za-z]/.test(ch)) assert.notEqual(once[i].toUpperCase(), ch.toUpperCase(), `${text} ${i}`);
      });
    }
  }
  assert.equal(C.enigma('AB-C', 0).end, 3);
});

test('反転の単位: コード単位は途中が壊れ、コードポイントは国旗が崩れ、書記素は見た目を保つが、ハングルの字母では2回で戻らない', () => {
  const smile = String.fromCodePoint(0x1f600);
  const s = `A${smile}B`;
  const cu = C.reverseBy(s, 'codeUnit');
  assert.ok(!C.wellFormed(cu));
  assert.equal(C.reverseBy(cu, 'codeUnit'), s);
  assert.ok(C.wellFormed(C.reverseBy(s, 'codePoint')));
  const flags = String.fromCodePoint(0x1f1ef, 0x1f1f5, 0x1f1fa, 0x1f1f8);
  assert.equal(C.reverseBy(flags, 'codePoint'), String.fromCodePoint(0x1f1f8, 0x1f1fa, 0x1f1f5, 0x1f1ef));
  assert.equal(C.reverseBy(flags, 'grapheme'), String.fromCodePoint(0x1f1fa, 0x1f1f8, 0x1f1ef, 0x1f1f5));
  assert.equal(C.reverseBy(C.reverseBy(flags, 'grapheme'), 'grapheme'), flags);
  // 母音字母 U+1161 のあとに子音字母 U+1100（2つの書記素）を反転すると、子音＋母音の1つの書記素になって戻らない
  const jamo = chr(0x1161, 0x1100);
  assert.equal(C.graphemes(jamo).length, 2);
  const once = C.reverseBy(jamo, 'grapheme');
  assert.equal(once, chr(0x1100, 0x1161));
  assert.equal(C.graphemes(once).length, 1);
  assert.notEqual(C.reverseBy(once, 'grapheme'), jamo);
  for (const unit of ['codeUnit', 'codePoint']) assert.equal(C.reverseBy(C.reverseBy(jamo, unit), unit), jamo, unit);
  assert.ok(C.wellFormed('') && C.wellFormed('ABC') && !C.wellFormed(chr(0xd83d)) && !C.wellFormed(chr(0xde00, 0x41)));
});

test('XOR: 同じ鍵でもう一度 XOR すると戻る。同じ鍵を2回使うと、暗号文どうしの XOR は平文どうしの XOR と同じ', () => {
  const key = Uint8Array.from({ length: C.KEY_BYTES }, (_, i) => (i * 37 + 11) % 256);
  for (const text of ['ATTACK AT DAWN', 'こんにちは', '']) {
    const p = C.utf8(text);
    const c = C.xorBytes(p, key);
    assert.equal(new TextDecoder().decode(C.xorBytes(c, key)), text);
  }
  assert.equal(C.toHex(C.utf8('A')), '41');
  assert.equal(C.toHex(Uint8Array.from([0, 255, 16])), '00 ff 10');
  const r = C.twoTimePad(C.utf8('ATTACK AT DAWN'), C.utf8('RETREAT AT NINE'), key);
  assert.equal(r.length, 14);
  assert.deepEqual(r.cx, r.px);
  assert.deepEqual(C.xorBytes(r.c1, r.px), r.c2);
});

test('自己逆の Hill 行列の例は A² ≡ I (mod 26)、行列式25（26と互いに素）', () => {
  assert.deepEqual(C.mulMod(C.HILL_INVOLUTORY, C.HILL_INVOLUTORY, 26), [[1, 0], [0, 1]]);
  assert.equal(C.det2(C.HILL_INVOLUTORY, 26), 25);
});

test('共役: エニグマの簡易版の位置Aは、ローターIで反転円盤Bを挟んだもの。対合を挟むと、どの並べ替えでも対合のままで不動点の数も同じ', () => {
  const R = C.parseAlphabet(C.ROTOR_I).map;
  const U = C.parseAlphabet(C.UKW_B).map;
  assert.deepEqual(C.conjugate(R, U), C.enigmaMapAt(0));
  assert.deepEqual(C.invertMap(C.invertMap(R)), R);
  let seed = 7;
  const rand = (n) => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed % n;
  };
  for (const key of ['ukwB', 'atbash', 'beaufortA', 'rot13']) {
    const h = C.parseAlphabet(C.PRESETS[key]()).map;
    const before = C.analyzePermutation(h);
    for (let i = 0; i < 30; i++) {
      const g = [...Array(26).keys()];
      for (let j = 25; j > 0; j--) {
        const k = rand(j + 1);
        [g[j], g[k]] = [g[k], g[j]];
      }
      const after = C.analyzePermutation(C.conjugate(g, h));
      assert.ok(after.involution, key);
      assert.equal(after.fixed.length, before.fixed.length, key);
      assert.equal(after.pairs.length, before.pairs.length, key);
    }
  }
  // g⁻¹ で戻らずに h を続けるだけでは、対合にならない
  const plain = C.analyzePermutation(C.composeMaps(R, U));
  assert.ok(!plain.involution);
});

test('シャッフルの位置の置換は shuffle と同じ並べ替え。巡回の長さの最小公倍数と、論文の式（2 の法 n∓1 での位数）が、実際に回した回数と一致する', () => {
  const lcm = (a, b) => {
    const g = (x, y) => (y ? g(y, x % y) : x);
    return (a / g(a, b)) * b;
  };
  for (let n = 2; n <= 52; n += 2) {
    const deck = Array.from({ length: n }, (_, i) => String.fromCharCode(0x100 + i)).join('');
    for (const out of [true, false]) {
      const dest = C.shufflePositions(n, out);
      const once = C.shuffle(deck, out);
      [...deck].forEach((ch, i) => assert.equal([...once][dest[i]], ch, `${n} ${out} ${i}`));
      const byCycles = C.cyclesOf(dest).reduce((acc, c) => lcm(acc, c.length), 1);
      const byRun = C.orderOf(C.orderTransform(out ? 'outShuffle' : 'inShuffle'), deck).order;
      assert.equal(byCycles, byRun, `${n} ${out}`);
      assert.equal(C.shuffleOrder(n, out), byRun, `${n} ${out}`);
    }
  }
  assert.deepEqual([C.shuffleOrder(52, true), C.shuffleOrder(52, false), C.shuffleOrder(26, true), C.shuffleOrder(26, false)], [8, 52, 20, 18]);
  // 52枚はインシャッフル26回で逆順になる（論文の記述）
  let deck = Array.from({ length: 52 }, (_, i) => String.fromCharCode(0x100 + i)).join('');
  const start = deck;
  for (let i = 0; i < 26; i++) deck = C.shuffle(deck, false);
  assert.equal(deck, [...start].reverse().join(''));
  assert.deepEqual(C.cyclesOf(C.shufflePositions(8, true)), [[0], [1, 2, 4], [3, 6, 5], [7]]);
});

test('自己逆の Hill 行列: 可逆な2×2行列157,248個のうち、A² ≡ I は736個。どれでも文は2回で戻る', () => {
  const { invertible, involutory } = C.hill2Census();
  assert.equal(invertible, 157248);
  assert.equal(involutory.length, 736);
  assert.ok(involutory.some((A) => JSON.stringify(A) === JSON.stringify(C.HILL_INVOLUTORY)));
  for (const A of involutory) assert.deepEqual(C.mulMod(A, A, 26), [[1, 0], [0, 1]]);
  assert.deepEqual(C.hillNormalize('Hello, World!'), { text: 'HELLOWORLD', padded: false });
  assert.deepEqual(C.hillNormalize('abc'), { text: 'ABCX', padded: true });
  for (const A of involutory.filter((_, i) => i % 23 === 0)) {
    const once = C.hillApply(A, 'ATTACK AT DAWN');
    assert.equal(C.hillApply(A, once), 'ATTACKATDAWN');
  }
  // HI＝(7, 8) → (3·7+2·8, 9·7+23·8) mod 26 ＝ (11, 13)＝LN、LN → (3·11+2·13, 9·11+23·13) mod 26 ＝ (7, 8)＝HI
  assert.equal(C.hillApply(C.HILL_INVOLUTORY, 'HI'), 'LN');
  assert.equal(C.hillApply(C.HILL_INVOLUTORY, 'LN'), 'HI');
});
