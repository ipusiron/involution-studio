import test from 'node:test';
import assert from 'node:assert/strict';
import { read, load } from './load.js';

const { MESSAGES, t } = load('js/messages.js').InvolutionMessages;
// かな・カタカナ・漢字・全角の記号
const JAPANESE = new RegExp('[' + [[0x3000, 0x303f], [0x3040, 0x30ff], [0x3400, 0x9fff], [0xff00, 0xffef]]
  .map(([a, b]) => String.fromCharCode(a) + '-' + String.fromCharCode(b)).join('') + ']');

const placeholders = (s) => [...s.matchAll(/\{([a-z0-9]+)\}/g)].map((m) => m[1]).sort();

test('日本語と英語の辞書は同じキーを持ち、置き場所 {name} と太字の数もそろう', () => {
  assert.deepEqual(Object.keys(MESSAGES.en).sort(), Object.keys(MESSAGES.ja).sort());
  for (const k of Object.keys(MESSAGES.ja)) {
    assert.deepEqual(placeholders(MESSAGES.en[k]), placeholders(MESSAGES.ja[k]), k);
    for (const lang of ['ja', 'en']) assert.equal((MESSAGES[lang][k].match(/\*\*/g) || []).length % 2, 0, `${lang} ${k}`);
  }
});

test('英語の辞書に日本語の文字がない（言語の切り替えボタンの「日本語」を除く）', () => {
  for (const [k, v] of Object.entries(MESSAGES.en)) {
    if (k === 'ui.langButton' || k === 'ui.langLabel') continue;
    assert.doesNotMatch(v, JAPANESE, k);
  }
});

test('日本語の文言は、日本語と英数字のあいだに半角空白を入れない。「ブラウザ」でなく「ブラウザー」', () => {
  const bad = new RegExp(`(${JAPANESE.source} [A-Za-z0-9(])|([A-Za-z0-9)] ${JAPANESE.source})`);
  for (const [k, v] of Object.entries(MESSAGES.ja)) {
    assert.doesNotMatch(v, bad, k);
    assert.doesNotMatch(v, /ブラウザ(?!ー)/, k);
  }
});

test('画面のスクリプトが使うキーは、すべて辞書にある（組み立てるキーも含む）', () => {
  const src = ['script.js', 'js/theme.js'].map(read).join('\n');
  for (const m of src.matchAll(/\bt\('([a-z]+\.[A-Za-z0-9.]+)'/g)) assert.ok(MESSAGES.ja[m[1]] !== undefined, m[1]);
  for (const e of ['empty', 'many', 'wide', 'range']) assert.ok(MESSAGES.ja[`not.err.${e}`], e);
  for (const e of ['empty', 'odd', 'k']) assert.ok(MESSAGES.ja[`order.err.${e}`], e);
  for (const e of ['length', 'letters', 'duplicate']) assert.ok(MESSAGES.ja[`checker.err.${e}`], e);
  for (const k of ['conj.result', 'conj.notInv', 'conj.enigma', 'conj.plainResult']) assert.ok(MESSAGES.ja[k], k);
  for (const k of ['feistel.errValue', 'feistel.errKey', 'feistel.enc', 'feistel.dec', 'matrix.original', 'matrix.transposed']) assert.ok(MESSAGES.ja[k], k);
});

test('画面のスクリプトに日本語の文字列を直接書かない（文言は辞書に置く）', () => {
  for (const f of ['script.js', 'js/involution-core.js', 'js/theme.js', 'js/i18n.js']) {
    const code = read(f).split('\n').filter((line) => !/^\s*\/\//.test(line)).map((line) => line.replace(/\s\/\/.*$/, '')).join('\n');
    for (const m of code.matchAll(/'[^'\n]*'|`[^`\n]*`/g)) assert.doesNotMatch(m[0], JAPANESE, `${f}: ${m[0]}`);
  }
});

test('t は置き場所を値で埋め、未知のキーはキーのまま返す', () => {
  assert.equal(t('demo.back', { n: 2, text: 'HELLO' }, 'ja'), '2回適用して、元の「HELLO」に戻りました。');
  assert.equal(t('demo.back', { n: 2, text: 'HELLO' }, 'en'), 'Applied 2 times and back to the original "HELLO".');
  assert.equal(t('no.such.key', {}, 'ja'), 'no.such.key');
});

test('文言の中の数値は計算部と同じ（ROT47 の文字数・Feistel の4096通り中50通り）', () => {
  const C = load('js/involution-core.js').InvolutionCore;
  let moved = 0;
  for (let c = 0; c < 128; c++) if (C.rot47(String.fromCharCode(c)) !== String.fromCharCode(c)) moved++;
  assert.equal(moved, 94);
  assert.match(MESSAGES.ja['rot47.body'], /33〜126（数字・記号・英字の94文字）を半分（47文字）/);
  assert.match(MESSAGES.ja['feistel.note'], /4096通りのうち戻るのは50通り/);
  assert.match(MESSAGES.en['feistel.note'], /only 50 of the 4,096 combinations/);
  assert.match(MESSAGES.en['rot47.body'], /ASCII 33–126 \(94 characters: digits, symbols and letters\) by half \(47 characters\)/);
});
