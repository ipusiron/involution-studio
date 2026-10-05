import test from 'node:test';
import assert from 'node:assert/strict';
import { read, load } from './load.js';

const html = read('index.html');
const { MESSAGES, t } = load('js/messages.js').InvolutionMessages;
const { parseVars } = load('js/i18n.js').InvolutionI18n;
const SCRIPTS = ['script.js', 'js/involution-core.js', 'js/messages.js', 'js/i18n.js', 'js/theme.js', 'js/theme-init.js'];
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

test('CSP はスクリプト・スタイルを同じ場所のファイルだけに限り、unsafe-inline と外部の通信を許さない', () => {
  const csp = html.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/)[1];
  assert.equal(csp, "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; "
    + "connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'");
  assert.match(html, /<meta name="referrer" content="no-referrer">/);
  assert.match(html, /<link rel="icon" href="data:,">/);
});

test('HTML に style 属性・インラインのスクリプト・イベントハンドラーがない。外部リンクは noopener noreferrer', () => {
  assert.doesNotMatch(html, /\sstyle=/);
  assert.doesNotMatch(html, /\son[a-z]+=/i);
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
  assert.deepEqual(scripts, ['js/theme-init.js', 'js/involution-core.js', 'js/messages.js', 'js/i18n.js', 'js/theme.js', 'script.js']);
  assert.equal((html.match(/<script/g) || []).length, scripts.length);
  for (const a of html.match(/<a [^>]*>/g)) assert.match(a, /target="_blank" rel="noopener noreferrer"/, a);
});

test('タブは WAI-ARIA の形（tablist の中はタブだけ、aria-controls の先が実在、最初のタブだけ選択）', () => {
  const nav = html.match(/<nav class="tabs" role="tablist"[\s\S]*?<\/nav>/)[0];
  assert.equal((nav.match(/<button/g) || []).length, 4);
  const tabs = [...nav.matchAll(/role="tab" id="(tab-[a-z]+)" data-tab="([a-z]+)" aria-controls="(panel-[a-z]+)" aria-selected="(true|false)"/g)];
  assert.deepEqual(tabs.map((m) => [m[2], m[4]]), [['basics', 'true'], ['subst', 'false'], ['trans', 'false'], ['bits', 'false']]);
  for (const [, id, , panel, selected] of tabs) {
    const tag = html.match(new RegExp(`<section [^>]*id="${panel}"[^>]*>`))[0];
    assert.match(tag, new RegExp(`role="tabpanel"[^>]*aria-labelledby="${id}"`), panel);
    assert.equal(/\shidden/.test(tag), selected === 'false', panel);
  }
  assert.doesNotMatch(nav, /btn-theme|btn-lang/);
});

test('アコーディオンは見出しの中のボタンで開閉し、aria-controls の先が実在して最初は閉じている', () => {
  const headers = [...html.matchAll(/<button type="button" class="accordion-header" id="([a-z0-9-]+)" aria-expanded="false" aria-controls="([a-z0-9-]+)">/g)];
  assert.equal(headers.length, 17);
  for (const [, btn, region] of headers) {
    assert.match(html, new RegExp(`<div class="accordion-content" id="${region}" role="region" aria-labelledby="${btn}" hidden>`), region);
  }
  assert.equal((html.match(/<h3 class="accordion-heading">/g) || []).length, headers.length);
});

test('ボタンは type="button"、入力欄と選択欄にはラベルがある', () => {
  for (const b of html.match(/<button[^>]*>/g)) assert.match(b, /type="button"/, b);
  for (const m of html.matchAll(/<(input|select) [^>]*id="([^"]+)"/g)) assert.match(html, new RegExp(`<label [^>]*for="${m[2]}"`), m[2]);
});

// 文言の太字（**）と改行（\n）は HTML の strong と br に当たる。HTML 側のタグを外して比べる
const plain = (s) => s.replace(/\n\s*/g, '').replace(/<br>/g, '\n').replace(/<[^>]+>/g, '')
  .replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').trim();
const fromDict = (s) => s.replace(/\*\*/g, '');

test('data-i18n のキーは辞書にあり、HTML に書いた日本語は辞書の日本語と同じ（太字・改行・差し込む値も）', () => {
  let n = 0;
  for (const m of html.matchAll(/<([a-z0-9]+)([^>]*?)data-i18n="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const attrs = m[2] + m[4];
    const key = m[3];
    assert.ok(MESSAGES.ja[key] !== undefined, key);
    const vars = parseVars((attrs.match(/data-i18n-vars="([^"]*)"/) || [])[1]);
    assert.equal(plain(m[5]), fromDict(t(key, vars, 'ja')), key);
    n++;
  }
  assert.ok(n >= 70, String(n));
  for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const pair of m[1].split(';')) assert.ok(MESSAGES.ja[pair.split(':')[1]] !== undefined, pair);
  }
});

test('画面のスクリプトが参照する id は、すべて HTML にある', () => {
  const src = read('script.js');
  for (const m of src.matchAll(/\$\('([a-z0-9-]+)'\)/g)) assert.ok(ids.has(m[1]), m[1]);
  for (const id of ['atbash', 'rot13', 'rot47', 'reverse', 'pairs', 'enigma']) {
    for (const part of ['input', 'result', 'status', 'run', 'again', 'clear']) assert.ok(ids.has(`${id}-${part}`), `${id}-${part}`);
  }
  for (const i of [1, 2, 3, 4]) assert.ok(ids.has(`feistel-k${i}`), i);
});

test('JS は innerHTML・eval を使わず、style を書き換えない。document 全体の keydown を拾わない', () => {
  for (const f of SCRIPTS) {
    const src = read(f);
    assert.doesNotMatch(src, /innerHTML|outerHTML|insertAdjacentHTML|\beval\(|new Function|document\.write/, f);
    assert.doesNotMatch(src, /\.style\b|setAttribute\('style'|cssText/, f);
    assert.doesNotMatch(src, /console\.(log|debug|info)/, f);
    assert.doesNotMatch(src, /document\.addEventListener\('keydown'/, f);
  }
});

test('localStorage は try で囲んで読み書きする（使えない環境でも画面が止まらない）', () => {
  for (const f of SCRIPTS) {
    const src = read(f);
    const uses = (src.match(/localStorage\./g) || []).length;
    const guarded = [...src.matchAll(/try \{\s*(?:const [a-z]+ = |return )?localStorage\.|try \{\s*localStorage\./g)].length;
    assert.equal(guarded, uses, f);
  }
});

test('判定器に書いた通り数（26文字の対合と、不動点のない対合）は、計算部の値と同じ', () => {
  const C = load('js/involution-core.js').InvolutionCore;
  const vars = parseVars(html.match(/data-i18n="checker.count" data-i18n-vars="([^"]+)"/)[1]);
  assert.deepEqual(vars, { all: C.involutionCount(26).toLocaleString('en-US'), free: C.fixedPointFreeCount(26).toLocaleString('en-US') });
});

test('Hill の生成器に書いた個数（可逆な2×2行列と、そのうち自己逆のもの）は、計算部が全部数えた値と同じ', () => {
  const C = load('js/involution-core.js').InvolutionCore;
  const vars = parseVars(html.match(/data-i18n="hill.count" data-i18n-vars="([^"]+)"/)[1]);
  const { invertible, involutory } = C.hill2Census();
  assert.deepEqual(vars, { invertible: invertible.toLocaleString('en-US'), involutory: involutory.length.toLocaleString('en-US') });
});
