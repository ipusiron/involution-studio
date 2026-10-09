import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { read, core } from './load.js';

const C = core();
const ROOT = fileURLToPath(new URL('..', import.meta.url));

const DOCS = {
  ja: {
    file: 'README.md', switcher: '[English](README.en.md) · 日本語', day: '**Day051 - 生成AIで作るセキュリティツール100**',
    shots: /^assets\/screenshot\d*\.png$/,
    sec: { tech: '🔬 技術的な説明', tree: '📁 ディレクトリー構造', about: '🛠️ このツールについて' },
    head: { examples: '| 変換 | 例（1回目） |', feistel: '| 手順 |', order: '| 変換 | 入力 |', checker: '| 換字表 |' },
    orderNames: { 'シーザー（3ずらし）': ['caesar', 3], ROT13: ['rot13', 0], 'パーフェクトシャッフル（アウト）': ['outShuffle', 0], 'パーフェクトシャッフル（イン）': ['inShuffle', 0] },
    presets: { Atbash: 'atbash', ROT13: 'rot13', 'Beaufort（鍵A）': 'beaufortA', 'Beaufort（鍵B）': 'beaufortB', 'エニグマの反転円盤B': 'ukwB', 'シーザー（3ずらし）': 'caesar3',
      'エニグマのローターI': 'rotorI' },
    verdict: { yes: '対合', no: '対合でない', none: 'なし' },
    claims2: ['532,985,208,200,576通り', '7,905,853,580,625通り', '26/gcd(k, 26)', 'A = [[3, 2], [9, 23]]', '開始位置A・入力HELLOWORLDの暗号文はFJGANRHBSE',
      '(1)(2 3 5)(4 7 6)(8)で、位数は3', 'インシャッフルを26回くり返すと順番が逆', 'HIはLNに、LNはHIに戻ります', '可逆なものは157,248個、そのうち自己逆なものは736個'],
    names: { Atbash: 'atbash', ROT13: 'rot13', ROT47: 'rot47', '文字反転': 'reverse', 'ペア交換': 'pairs', 'ビット反転': 'not' },
    claims: ['(1010, 0000)＝160', '元の170に戻る', '入力値170（10101010）、鍵5・3・12・9', '4096通りのうち戻るのは50通り',
      'アウトシャッフルなら8回', 'インシャッフルなら52回', 'K16からK1の逆順'],
    forbidden: /ペア交換／Perfect Shuffle|ビットwise|レスポンシブ対応|4回押すと|準備中|ブラウザ(?!ー)|オートエンコーダー/
  },
  en: {
    file: 'README.en.md', switcher: 'English · [日本語](README.md)', day: '**Day051 - 100 Security Tools with Generative AI**',
    shots: /^assets\/en\/screenshot\d*\.png$/,
    sec: { tech: '🔬 Technical notes', tree: '📁 Directory structure', about: '🛠️ About this tool' },
    head: { examples: '| Transform | Example (first application) |', feistel: '| Step |', order: '| Transform | Input |', checker: '| Substitution table |' },
    orderNames: { 'Caesar (shift 3)': ['caesar', 3], ROT13: ['rot13', 0], 'Perfect shuffle (out)': ['outShuffle', 0],
      'Perfect shuffle (in)': ['inShuffle', 0] },
    presets: { Atbash: 'atbash', ROT13: 'rot13', 'Beaufort (key A)': 'beaufortA', 'Beaufort (key B)': 'beaufortB', 'Enigma reflector B': 'ukwB',
      'Caesar (shift 3)': 'caesar3', 'Enigma rotor I': 'rotorI' },
    verdict: { yes: 'Involution', no: 'Not an involution', none: 'none' },
    claims2: ['532,985,208,200,576 are involutions', '7,905,853,580,625 of those', '26/gcd(k, 26)', 'A = [[3, 2], [9, 23]]',
      'the input HELLOWORLD encrypts to FJGANRHBSE',
      '(1)(2 3 5)(4 7 6)(8), and the order is 3', '52 cards are reversed by 26 in-shuffles', 'turns HI into LN and LN back into HI',
      '157,248 are invertible, and 736 of those'],
    names: { Atbash: 'atbash', ROT13: 'rot13', ROT47: 'rot47', 'String reversal': 'reverse', 'Pair swap': 'pairs', 'Bitwise NOT': 'not' },
    claims: ['(1010, 0000) = 160', 'gives back the original 170', 'input value 170 (10101010) and the keys 5, 3, 12 and 9',
      'only 50 of the 4096 combinations', '8 out-shuffles', '52 in-shuffles', 'from K16 to K1'],
    forbidden: /Pair swap ?[/／] ?Perfect shuffle|coming soon|autoencoder/i
  }
};
for (const d of Object.values(DOCS)) d.text = read(d.file);

const APPLY = {
  atbash: (s) => C.atbash(s).output,
  rot13: C.rot13,
  rot47: C.rot47,
  reverse: C.reverse,
  pairs: (s) => C.swapPairs(s).output
};

function section(text, heading) {
  const i = text.indexOf(`\n## ${heading}`);
  assert.ok(i >= 0, heading);
  const rest = text.slice(i + 1);
  const end = rest.indexOf('\n## ', 3);
  return end < 0 ? rest : rest.slice(0, end);
}

function table(text, firstHeader) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith(firstHeader));
  assert.ok(start >= 0, firstHeader);
  const rows = [];
  for (let i = start + 2; i < lines.length && lines[i].startsWith('|'); i++) rows.push(lines[i].split(' | ').map((c) => c.replace(/^\| ?| ?\|$/g, '').trim()));
  return rows;
}

const noCode = (md) => md.replace(/```[\s\S]*?```/g, '');
const h2 = (md) => noCode(md).split('\n').filter((l) => l.startsWith('## ')).map((l) => l.slice(3));
const headings = (md) => noCode(md).split('\n').filter((l) => /^#{1,4} /.test(l));

// パーフェクトシャッフルで元の順に戻るまでの回数（アウトシャッフル・インシャッフル）
function shuffleOrder(n, out) {
  const start = [...Array(n).keys()];
  const once = (a) => a.slice(0, n / 2).flatMap((x, i) => (out ? [x, a[n / 2 + i]] : [a[n / 2 + i], x]));
  let a = once(start);
  let k = 1;
  while (a.join() !== start.join()) {
    a = once(a);
    k++;
  }
  return k;
}

test('YAML メタデータの構造（キーの順、ブロック形式のリスト、固定の値）。YAML は README.md だけに置く', () => {
  const m = DOCS.ja.text.match(/^<!--\n---\n([\s\S]*?)\n---\n-->\n/);
  assert.ok(m, 'YAML block');
  const keys = [...m[1].matchAll(/^([a-z_]+):/gm)].map((x) => x[1]);
  assert.deepEqual(keys, ['id', 'slug', 'title', 'subtitle_ja', 'subtitle_en', 'description_ja', 'description_en', 'category_ja', 'category_en',
    'difficulty', 'tags', 'repo_url', 'demo_url', 'hub']);
  for (const k of ['category_ja', 'category_en', 'tags']) assert.match(m[1], new RegExp(`^${k}:\\n  - `, 'm'), k);
  assert.match(m[1], /^id: day051$/m);
  assert.match(m[1], /^slug: involution-studio$/m);
  assert.match(m[1], /^repo_url: "https:\/\/github.com\/ipusiron\/involution-studio"$/m);
  assert.match(m[1], /^demo_url: "https:\/\/ipusiron.github.io\/involution-studio\/"$/m);
  assert.match(m[1], /^hub: true$/m);
  assert.doesNotMatch(DOCS.en.text, /^<!--/);
});

test('日英の README は同じ見出しを同じ順に持つ（階層と絵文字がそろう）', () => {
  const ja = headings(DOCS.ja.text);
  const en = headings(DOCS.en.text);
  assert.equal(en.length, ja.length);
  ja.forEach((h, i) => {
    assert.equal(en[i].match(/^#+/)[0], h.match(/^#+/)[0], `${h} / ${en[i]}`);
    const first = [...h.replace(/^#+ /, '')][0];
    if (/^#{2,3} /.test(h) && /\p{Extended_Pictographic}/u.test(first)) assert.equal([...en[i].replace(/^#+ /, '')][0], first, `${h} / ${en[i]}`);
  });
});

for (const [lang, d] of Object.entries(DOCS)) {
  test(`${d.file}: シリーズ標準の構成（前半と後半の見出しの順、Day の表記、言語の切り替え、プロジェクトのリンク）と、古い記述がないこと`, () => {
    const heads = h2(d.text);
    assert.ok(d.text.includes(d.switcher));
    assert.match(d.text, /\n# Involution Studio - .+\n/);
    assert.ok(d.text.includes(d.day));
    assert.ok(heads[0].startsWith('🌐'));
    assert.ok(heads[1].startsWith('📸'));
    assert.deepEqual(heads.slice(-4).map((h) => [...h][0]), ['📁', '💻', '📄', '🛠']);
    for (const icon of ['✨', '📖', '🎯', '🔒', '⚠', '🧪', '🔬', '🔗']) assert.ok(heads.some((h) => h.startsWith(icon)), icon);
    assert.match(section(d.text, d.sec.about), /https:\/\/akademeia\.info\/\?page_id=42163/);
    for (const b of ['stars', 'forks', 'last-commit', 'license']) assert.ok(d.text.includes(`img.shields.io/github/${b}/ipusiron/involution-studio`), b);
    assert.doesNotMatch(d.text, d.forbidden);
  });

  test(`${d.file}: 強調は1節に2か所まで、箇条書きの項目名を太字にしない、文末にコロンを置かない`, () => {
    for (const h of h2(d.text)) {
      const n = (section(d.text, h).match(/\*\*[^*\n]+\*\*/g) || []).length;
      assert.ok(n <= 2, `${h}: ${n}`);
    }
    assert.doesNotMatch(d.text, /^\s*- \*\*/m);
    if (lang === 'ja') assert.doesNotMatch(noCode(d.text).replace(/<!--[\s\S]*?-->/, ''), /[：:]$/m);
  });

  test(`${d.file}: 変換の例の表は、計算部で1回目・2回目を計算し直した値と同じ`, () => {
    const rows = table(section(d.text, d.sec.tech), d.head.examples);
    assert.equal(rows.length, 6);
    for (const [name, first, second] of rows) {
      const kind = d.names[name];
      assert.ok(kind, name);
      if (kind === 'not') {
        const [, a, abin, b, bbin] = first.match(/^(\d+) ?[（(]([01]{8})[）)] → (\d+) ?[（(]([01]{8})[）)]$/);
        assert.equal(C.bitNot(Number(a)), Number(b));
        assert.equal(C.toBinary(Number(a), 8), abin);
        assert.equal(C.toBinary(Number(b), 8), bbin);
        assert.equal(second, `${b} → ${a}`);
        continue;
      }
      const [x, y] = first.split(' → ');
      assert.equal(APPLY[kind](x), y, `${name} ${x}`);
      assert.equal(second, `${y} → ${x}`, name);
      assert.equal(APPLY[kind](y), x, `${name} ${y}`);
    }
  });

  test(`${d.file}: Feistel の手順表と本文の数値は、計算部で計算し直した値と同じ`, () => {
    const sec = section(d.text, d.sec.tech);
    const rows = table(sec, d.head.feistel);
    const { steps, cipher, plain } = C.feistelSteps(170, [5, 3, 12, 9]);
    assert.equal(rows.length, steps.length);
    const nib = (v) => C.toBinary(v, 4);
    rows.forEach(([, key, f, after], i) => {
      const s = steps[i];
      assert.equal(key, s.phase === 'swap' ? '—' : String(s.key), String(i + 1));
      assert.equal(f, s.phase === 'swap' ? '—' : nib(s.f), String(i + 1));
      assert.equal(after, `(${nib(s.after.L)}, ${nib(s.after.R)})`, String(i + 1));
    });
    assert.equal(cipher, 160);
    assert.equal(plain, 170);
    assert.equal(C.toBinary(170, 8), '10101010');
    for (const c of d.claims) assert.ok(sec.includes(c), c);
    // 同じ鍵のまま4ラウンド続けて元に戻る組（入力256×鍵16）
    let back = 0;
    for (let v = 0; v < 256; v++) {
      for (let k = 0; k < 16; k++) {
        let L = v >> 4;
        let R = v & 15;
        for (let r = 0; r < 4; r++) ({ L, R } = C.feistelRound(L, R, k));
        if (((L << 4) | R) === v) back++;
      }
    }
    assert.equal(back, 50);
    assert.equal(shuffleOrder(52, true), 8);
    assert.equal(shuffleOrder(52, false), 52);
    // テストの節に書いた鍵の組の数（46組）は、core.test.js の組み立てと同じ
    const coreTest = read('test/core.test.js');
    assert.match(coreTest, /const keySets = \[C\.FEISTEL_KEYS, \[0, 0, 0, 0\], \[15, 15, 15, 15\], \[1, 2, 3\], \[7\], \[9, 4, 14, 1, 6, 11\]\];/);
    assert.match(coreTest, /for \(let i = 0; i < 40; i\+\+\) keySets\.push/);
    assert.ok(d.text.includes(lang === 'ja' ? '256通り×46組の鍵' : '256 values × 46 key sets'));
  });

  test(`${d.file}: 位数の表・判定器の表・エニグマの例・対合の数は、計算部で計算し直した値と同じ`, () => {
    const sec = section(d.text, d.sec.tech);
    const orders = table(sec, d.head.order);
    assert.equal(orders.length, 6);
    for (const [name, input, times] of orders) {
      const [kind, k] = d.orderNames[name];
      assert.equal(C.orderOf(C.orderTransform(kind, k), input).order, Number(times), `${name} ${input}`);
    }
    const checks = table(sec, d.head.checker);
    assert.equal(checks.length, 7);
    for (const [name, verdict, fixed, pairs, order] of checks) {
      const r = C.analyzePermutation(C.parseAlphabet(C.PRESETS[d.presets[name]]()).map);
      assert.equal(verdict, r.involution ? d.verdict.yes : d.verdict.no, name);
      assert.equal(fixed, r.fixed.length ? r.fixed.join(', ') : d.verdict.none, name);
      assert.equal(Number(pairs), r.pairs.length, name);
      assert.equal(Number(order), r.order, name);
    }
    for (const c of d.claims2) assert.ok(sec.includes(c), c);
    assert.ok(sec.includes(C.ROTOR_I) && sec.includes(C.UKW_B));
    assert.equal(C.enigma('HELLOWORLD', 0).output, 'FJGANRHBSE');
    assert.equal(C.enigma('FJGANRHBSE', 0).output, 'HELLOWORLD');
    assert.equal(C.involutionCount(26).toLocaleString('en-US'), '532,985,208,200,576');
    assert.equal(C.fixedPointFreeCount(26).toLocaleString('en-US'), '7,905,853,580,625');
    assert.deepEqual(C.mulMod(C.HILL_INVOLUTORY, C.HILL_INVOLUTORY, 26), [[1, 0], [0, 1]]);
    assert.equal(C.det2(C.HILL_INVOLUTORY, 26), 25);
    assert.deepEqual(C.cyclesOf(C.shufflePositions(8, true)).map((c) => `(${c.map((i) => i + 1).join(' ')})`).join(''), '(1)(2 3 5)(4 7 6)(8)');
    assert.equal(C.hillApply(C.HILL_INVOLUTORY, 'HI'), 'LN');
    assert.equal(C.hillApply(C.HILL_INVOLUTORY, 'LN'), 'HI');
    assert.deepEqual([C.hill2Census().invertible, C.hill2Census().involutory.length], [157248, 736]);
    assert.deepEqual(C.conjugate(C.parseAlphabet(C.ROTOR_I).map, C.parseAlphabet(C.UKW_B).map), C.enigmaMapAt(0));
  });

  test(`${d.file}: ディレクトリー構造にすべてのファイルとディレクトリーが載り、全行に説明がある`, () => {
    const block = section(d.text, d.sec.tree).match(/```\n([\s\S]*?)```/)[1];
    const lines = block.split('\n').filter((l) => l.trim()).slice(1);
    const listed = new Set();
    for (const line of lines) {
      const m = line.match(/[├└]── ([^\s#]+)\s+# \S/);
      assert.ok(m, `説明のない行: ${line}`);
      listed.add(m[1].replace(/\/$/, ''));
    }
    const walk = (dir) => fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })
      .filter((x) => !['.git', 'node_modules', '.claude'].includes(x.name))
      .flatMap((x) => (x.isDirectory() ? [x.name, ...walk(path.join(dir, x.name))] : [x.name]));
    const all = walk('.');
    for (const name of all) assert.ok(listed.has(name), `ツリーにない: ${name}`);
    for (const name of listed) assert.ok(all.includes(name), `実在しない: ${name}`);
  });
}

test('参考文献の URL は日英で同じ', () => {
  const urls = (d) => [...section(d.text, d.sec.tech).matchAll(/\]\((https:\/\/[^)\s]+(?:\([^)]*\)[^)\s]*)?)\)/g)].map((m) => m[1]);
  assert.deepEqual(urls(DOCS.en), urls(DOCS.ja));
  assert.equal(urls(DOCS.ja).length, 9);
});

test('画像: 参照はすべて実在する。スクリーンショットは日本語版が assets/、英語版が assets/en/ の6枚。どこからも参照しない画像は置かない', () => {
  const refs = {};
  for (const [lang, d] of Object.entries(DOCS)) {
    refs[lang] = [...d.text.matchAll(/!\[[^\]]*\]\((assets\/[^)]+)\)/g)].map((m) => m[1]);
    for (const r of refs[lang]) assert.ok(fs.existsSync(path.join(ROOT, r)), r);
    const shots = refs[lang].filter((r) => /screenshot/.test(r));
    assert.equal(shots.length, 6, lang);
    for (const r of shots) {
      assert.match(r, d.shots, r);
      assert.ok(fs.statSync(path.join(ROOT, r)).size <= 300 * 1024, r);
    }
  }
  const used = new Set([...refs.ja, ...refs.en]);
  const files = (dir) => fs.readdirSync(path.join(ROOT, dir)).filter((f) => /\.(png|jpg)$/.test(f)).map((f) => `${dir}/${f}`);
  for (const f of [...files('assets'), ...files('assets/en')]) assert.ok(used.has(f), `参照していない画像: ${f}`);
});

test('ユースケースの「このツールならではの使い方」の値は計算部と同じ（日英）', () => {
  const ja = DOCS.ja.text, en = DOCS.en.text;
  assert.equal(C.rot13('HELLO'), 'URYYB');
  assert.equal(C.rot13(C.rot13('HELLO')), 'HELLO');
  assert.equal(C.orderOf((t) => C.rot13(t), 'HELLO').order, 2);
  const deck = Array.from({ length: 52 }, (_, i) => String.fromCodePoint(0x100 + i)).join('');
  assert.equal(C.orderOf((t) => C.shuffle(t, true), deck).order, 8);
  assert.equal((2 ** 8) % 51, 1);
  assert.ok(ja.includes('HELLOをURYYBに') && en.includes('HELLO into URYYB'));
  assert.ok(ja.includes('8回で元の並びに戻る') && en.includes('returns to the original order after 8'));
  const p1 = C.utf8('HELLO'), p2 = C.utf8('WORLD'), key = C.utf8('ABCDE');
  const r = C.twoTimePad(p1, p2, key);
  assert.equal(C.toHex(C.xorBytes(r.c1, r.c2)), C.toHex(C.xorBytes(p1, p2)));
});
