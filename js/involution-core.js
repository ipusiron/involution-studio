// インボリューション（2回適用すると元に戻る変換）の計算部。DOM に触れない純粋な関数だけを置く。globalThis.InvolutionCore に置く
(() => {
  'use strict';

  // 文字列をコードポイント（サロゲートペアを1文字）の配列に分ける
  const codePoints = (text) => Array.from(String(text));

  // Atbash: A↔Z、B↔Y…（大文字・小文字を保ち、英字以外はそのまま）。used は使った英字（大文字）の一覧
  function atbash(text) {
    let output = '';
    const used = new Set();
    for (const ch of codePoints(text)) {
      const c = ch.codePointAt(0);
      if (c >= 65 && c <= 90) {
        output += String.fromCharCode(155 - c);
        used.add(ch);
      } else if (c >= 97 && c <= 122) {
        output += String.fromCharCode(219 - c);
        used.add(ch.toUpperCase());
      } else {
        output += ch;
      }
    }
    return { output, used: [...used].sort() };
  }

  // ROT13: 英字を13ずらす。ROT47: ASCII の 33〜126（94文字）を47ずらす。どちらも2回で元に戻る
  function rot13(text) {
    return codePoints(text).map((ch) => {
      const c = ch.codePointAt(0);
      if (c >= 65 && c <= 90) return String.fromCharCode(65 + ((c - 65 + 13) % 26));
      if (c >= 97 && c <= 122) return String.fromCharCode(97 + ((c - 97 + 13) % 26));
      return ch;
    }).join('');
  }

  function rot47(text) {
    return codePoints(text).map((ch) => {
      const c = ch.codePointAt(0);
      return c >= 33 && c <= 126 ? String.fromCharCode(33 + ((c - 33 + 47) % 94)) : ch;
    }).join('');
  }

  // 文字反転（コードポイント単位）。サロゲートペアを分けないので、途中の文字列も正しい Unicode のまま
  const reverse = (text) => codePoints(text).reverse().join('');

  // 隣り合う2文字ずつを入れ替える（コードポイント単位）。奇数個なら最後の1文字はそのまま
  function swapPairs(text) {
    const cp = codePoints(text);
    const pairs = [];
    let output = '';
    for (let i = 0; i < cp.length; i += 2) {
      if (i + 1 < cp.length) {
        output += cp[i + 1] + cp[i];
        pairs.push([cp[i], cp[i + 1]]);
      } else {
        output += cp[i];
      }
    }
    return { output, pairs, odd: cp.length % 2 ? cp[cp.length - 1] : null };
  }

  // 行列の転置と、元の行列との比較
  const transpose = (m) => m[0].map((_, j) => m.map((row) => row[j]));
  const sameMatrix = (a, b) => a.length === b.length && a.every((row, i) => row.length === b[i].length && row.every((v, j) => v === b[i][j]));

  // 8ビットの NOT（0〜255）
  const bitNot = (v) => (~v) & 0xff;
  const toBinary = (v, width) => v.toString(2).padStart(width, '0');

  // ビット反転の入力。mode は 'char'（1文字、U+0000〜U+00FF）か 'byte'（0〜255 の10進数）
  // 戻り値は { ok: true, value } か { ok: false, error }（error は empty・many・wide・range）
  function parseByteInput(mode, raw) {
    const text = String(raw);
    if (mode === 'char') {
      const cp = codePoints(text);
      if (cp.length === 0) return { ok: false, error: 'empty' };
      if (cp.length > 1) return { ok: false, error: 'many' };
      const value = cp[0].codePointAt(0);
      return value <= 0xff ? { ok: true, value } : { ok: false, error: 'wide' };
    }
    const trimmed = text.trim();
    if (trimmed === '') return { ok: false, error: 'empty' };
    if (!/^[0-9]{1,3}$/.test(trimmed) || Number(trimmed) > 255) return { ok: false, error: 'range' };
    return { ok: true, value: Number(trimmed) };
  }

  // 1バイトの値を見せるときの表記。印字できる文字はその文字、ほかは U+00XX
  function byteGlyph(v) {
    const printable = (v >= 0x21 && v <= 0x7e) || (v >= 0xa1 && v <= 0xff && v !== 0xad);
    return printable ? String.fromCharCode(v) : `U+${v.toString(16).toUpperCase().padStart(4, '0')}`;
  }

  // 0〜max の整数（10進の数字だけ）。それ以外は null
  function parseIntIn(raw, max) {
    const trimmed = String(raw).trim();
    if (!/^[0-9]{1,3}$/.test(trimmed)) return null;
    const n = Number(trimmed);
    return n <= max ? n : null;
  }

  // おもちゃの Feistel（8ビットを左右4ビットに分ける）。ラウンド関数 F は何でもよく、逆関数を持たなくてよい
  const FEISTEL_KEYS = [5, 3, 12, 9];
  const feistelF = (r, k) => ((r + k) % 16) ^ (r >> 2);

  // 1ラウンド: (L, R) → (R, L ⊕ F(R, k))
  function feistelRound(L, R, k) {
    const f = feistelF(R, k);
    return { L: R, R: (L ^ f) & 15, f };
  }

  // 入れ替えを除いた半ラウンド: (L, R) → (L ⊕ F(R, k), R)。これ自体がインボリューション
  function feistelHalf(L, R, k) {
    return { L: (L ^ feistelF(R, k)) & 15, R };
  }

  // 暗号化（鍵 k1…kn の順に n ラウンド）→ 左右を入れ替え → 同じ回路に鍵を逆順で n ラウンド → 入れ替え、の全手順
  // 各手順の after は、その手順を終えたあとの (L, R)
  function feistelSteps(value, keys = FEISTEL_KEYS) {
    let L = (value >> 4) & 15;
    let R = value & 15;
    const steps = [];
    keys.forEach((key, i) => {
      const r = feistelRound(L, R, key);
      steps.push({ phase: 'enc', round: i + 1, key, before: { L, R }, f: r.f, after: { L: r.L, R: r.R } });
      ({ L, R } = r);
    });
    const cipher = (L << 4) | R;
    steps.push({ phase: 'swap', before: { L, R }, after: { L: R, R: L } });
    [L, R] = [R, L];
    [...keys].reverse().forEach((key, i) => {
      const r = feistelRound(L, R, key);
      steps.push({ phase: 'dec', round: i + 1, key, before: { L, R }, f: r.f, after: { L: r.L, R: r.R } });
      ({ L, R } = r);
    });
    steps.push({ phase: 'swap', before: { L, R }, after: { L: R, R: L } });
    [L, R] = [R, L];
    return { steps, cipher, plain: (L << 4) | R };
  }

  // ===== 何回で元に戻るか（位数） =====

  // シーザー: 英字を k ずらす（大文字・小文字を保ち、英字以外はそのまま）
  function caesar(text, k) {
    const s = ((k % 26) + 26) % 26;
    return codePoints(text).map((ch) => {
      const c = ch.codePointAt(0);
      if (c >= 65 && c <= 90) return String.fromCharCode(65 + ((c - 65 + s) % 26));
      if (c >= 97 && c <= 122) return String.fromCharCode(97 + ((c - 97 + s) % 26));
      return ch;
    }).join('');
  }

  // パーフェクトシャッフル: 文字を札とみなし、半分に分けて1枚ずつ交互に重ねる（偶数個のときだけ）
  // out は上の札が上に残る（アウトシャッフル）、そうでなければ2枚目に入る（インシャッフル）
  function shuffle(text, out) {
    const cp = codePoints(text);
    const h = cp.length / 2;
    return cp.slice(0, h).flatMap((x, i) => (out ? [x, cp[h + i]] : [cp[h + i], x])).join('');
  }

  const ORDER_KINDS = ['caesar', 'rot13', 'atbash', 'reverse', 'pairs', 'outShuffle', 'inShuffle'];

  // 種類ごとの変換（k はシーザーのずらし幅）
  function orderTransform(kind, k) {
    return {
      caesar: (s) => caesar(s, k),
      rot13,
      atbash: (s) => atbash(s).output,
      reverse,
      pairs: (s) => swapPairs(s).output,
      outShuffle: (s) => shuffle(s, true),
      inShuffle: (s) => shuffle(s, false)
    }[kind];
  }

  // 位数の入力の確認。戻り値は null（よい）か、誤りの種類（empty・odd）
  function orderInputError(kind, text) {
    const n = codePoints(text).length;
    if (n === 0) return 'empty';
    if ((kind === 'outShuffle' || kind === 'inShuffle') && n % 2) return 'odd';
    return null;
  }

  // 元の文字列に戻るまで適用を繰り返す。states[0] が入力。limit 回で戻らなければ order は null
  function orderOf(apply, text, limit = 1000) {
    const states = [text];
    let cur = text;
    for (let n = 1; n <= limit; n++) {
      cur = apply(cur);
      states.push(cur);
      if (cur === text) return { order: n, states };
    }
    return { order: null, states };
  }

  // ===== 26文字の換字表の判定 =====

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const toMap = (s) => [...s].map((c) => c.charCodeAt(0) - 65);
  const mapToString = (m) => m.map((i) => ALPHABET[i]).join('');

  // 換字表（A〜Z の行き先を順に並べた26文字）を読む。小文字と空白は許す
  // 戻り値は { ok: true, map } か { ok: false, error }（error は length・letters・duplicate。duplicate は missing も返す）
  function parseAlphabet(raw) {
    const s = String(raw).toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z]*$/.test(s)) return { ok: false, error: 'letters' };
    if (s.length !== 26) return { ok: false, error: 'length', length: s.length };
    const map = toMap(s);
    const missing = [...ALPHABET].filter((c) => !s.includes(c));
    return missing.length ? { ok: false, error: 'duplicate', missing } : { ok: true, map };
  }

  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  // 置換を巡回に分ける。インボリューション＝長さ3以上の巡回がない（すべて不動点か2文字の組）
  function analyzePermutation(map) {
    const seen = new Array(map.length).fill(false);
    const cycles = [];
    for (let i = 0; i < map.length; i++) {
      if (seen[i]) continue;
      const cycle = [];
      for (let j = i; !seen[j]; j = map[j]) {
        seen[j] = true;
        cycle.push(ALPHABET[j]);
      }
      cycles.push(cycle);
    }
    const order = cycles.reduce((acc, c) => (acc / gcd(acc, c.length)) * c.length, 1);
    return {
      involution: cycles.every((c) => c.length <= 2),
      fixed: cycles.filter((c) => c.length === 1).map((c) => c[0]),
      pairs: cycles.filter((c) => c.length === 2),
      longer: cycles.filter((c) => c.length > 2),
      order
    };
  }

  // 判定器のプリセット（A〜Z の行き先の26文字）
  const ROTOR_I = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ';
  const UKW_B = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';
  const shiftAlphabet = (k) => mapToString([...ALPHABET].map((_, i) => (i + k) % 26));
  // Beaufort（鍵の文字 k、c = k − p mod 26）
  const beaufortAlphabet = (k) => mapToString([...ALPHABET].map((_, p) => (((k - p) % 26) + 26) % 26));
  const PRESETS = {
    atbash: () => mapToString([...ALPHABET].map((_, i) => 25 - i)),
    rot13: () => shiftAlphabet(13),
    caesar3: () => shiftAlphabet(3),
    beaufortA: () => beaufortAlphabet(0),
    beaufortB: () => beaufortAlphabet(1),
    ukwB: () => UKW_B,
    rotorI: () => ROTOR_I
  };

  // ランダムな対合（rand(n) は 0〜n−1 の整数を返す関数）。fixedPointFree なら13組、そうでなければ不動点を混ぜる
  // 一様に選ぶものではない（学習用の例を作るだけ）
  function randomInvolution(rand, fixedPointFree) {
    const order = [...Array(26).keys()];
    for (let i = order.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    const map = new Array(26);
    let i = 0;
    while (i < 26) {
      if (!fixedPointFree && (i === 25 || rand(4) === 0)) {
        map[order[i]] = order[i];
        i += 1;
      } else {
        map[order[i]] = order[i + 1];
        map[order[i + 1]] = order[i];
        i += 2;
      }
    }
    return mapToString(map);
  }

  // n 個の元の上のインボリューションの数と、そのうち不動点のないものの数（BigInt）
  function involutionCount(n) {
    let [a, b] = [1n, 1n];
    for (let m = 2; m <= n; m++) [a, b] = [b, b + BigInt(m - 1) * a];
    return n === 0 ? 1n : b;
  }

  function fixedPointFreeCount(n) {
    if (n % 2) return 0n;
    let r = 1n;
    for (let m = n - 1; m > 0; m -= 2) r *= BigInt(m);
    return r;
  }

  // ===== エニグマの簡易版（ローターI＋反転円盤B） =====
  // キーを押すとローターが1つ進み、そのあとで電流が ローター → 反転円盤 → ローター（逆向き）と通る
  const ROTOR_MAP = toMap(ROTOR_I);
  const ROTOR_INV = [];
  ROTOR_MAP.forEach((v, i) => {
    ROTOR_INV[v] = i;
  });
  const UKW_MAP = toMap(UKW_B);

  // ローターの位置 p（0〜25）での26文字の対応
  function enigmaMapAt(p) {
    return [...Array(26).keys()].map((c) => {
      let x = (ROTOR_MAP[(c + p) % 26] - p + 26) % 26;
      x = UKW_MAP[x];
      return (ROTOR_INV[(x + p) % 26] - p + 26) % 26;
    });
  }

  // 開始位置 start から文字列を通す。英字だけを変え、そのたびにローターが進む（大文字・小文字は保つ）
  function enigma(text, start) {
    let p = start;
    const output = codePoints(text).map((ch) => {
      const c = ch.codePointAt(0);
      const upper = c >= 65 && c <= 90;
      const lower = c >= 97 && c <= 122;
      if (!upper && !lower) return ch;
      p = (p + 1) % 26;
      const out = enigmaMapAt(p)[c - (upper ? 65 : 97)];
      return String.fromCharCode(out + (upper ? 65 : 97));
    }).join('');
    return { output, end: p };
  }

  // ===== 反転の単位 =====
  const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const graphemes = (text) => (segmenter ? [...segmenter.segment(String(text))].map((s) => s.segment) : null);

  // unit は codeUnit（UTF-16 のコード単位）・codePoint・grapheme（見た目の1文字）
  function reverseBy(text, unit) {
    if (unit === 'codeUnit') return String(text).split('').reverse().join('');
    if (unit === 'grapheme') {
      const g = graphemes(text);
      return g ? g.reverse().join('') : null;
    }
    return reverse(text);
  }

  // 孤立したサロゲートを含まないか（正しい UTF-16 の文字列か）
  function wellFormed(s) {
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c >= 0xd800 && c <= 0xdbff) {
        const d = s.charCodeAt(i + 1);
        if (!(d >= 0xdc00 && d <= 0xdfff)) return false;
        i++;
      } else if (c >= 0xdc00 && c <= 0xdfff) {
        return false;
      }
    }
    return true;
  }

  // ===== XOR（ストリーム暗号） =====
  const KEY_BYTES = 256;
  const utf8 = (text) => new TextEncoder().encode(String(text));
  const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ');

  function xorBytes(a, b) {
    const n = Math.min(a.length, b.length);
    const out = new Uint8Array(n);
    for (let i = 0; i < n; i++) out[i] = a[i] ^ b[i];
    return out;
  }

  // 同じ鍵で2つの平文を暗号化したとき、暗号文どうしの XOR は平文どうしの XOR と同じになる（鍵が消える）
  function twoTimePad(p1, p2, key) {
    const n = Math.min(p1.length, p2.length, key.length);
    const c1 = xorBytes(p1.subarray(0, n), key);
    const c2 = xorBytes(p2.subarray(0, n), key);
    return { length: n, c1, c2, cx: xorBytes(c1, c2), px: xorBytes(p1.subarray(0, n), p2.subarray(0, n)) };
  }

  // ===== 自己逆の Hill 行列の例（A² ≡ I mod 26） =====
  const HILL_INVOLUTORY = [[3, 2], [9, 23]];
  const mulMod = (X, Y, m) => X.map((row) => Y[0].map((_, j) => row.reduce((s, v, k) => s + v * Y[k][j], 0) % m));
  const det2 = (X, m) => (((X[0][0] * X[1][1] - X[0][1] * X[1][0]) % m) + m) % m;

  // ===== 共役（エニグマが2回で戻る理由） =====
  const invertMap = (m) => {
    const inv = [];
    m.forEach((v, i) => {
      inv[v] = i;
    });
    return inv;
  };

  // g を通り、h で折り返し、g を逆向きに戻る: c → g⁻¹(h(g(c)))。h が対合なら、どの g でも対合になる
  function conjugate(g, h) {
    const gi = invertMap(g);
    return g.map((_, c) => gi[h[g[c]]]);
  }

  // g のあとに h（g⁻¹ で戻らない）: c → h(g(c))
  const composeMaps = (g, h) => g.map((_, c) => h[g[c]]);

  // ===== パーフェクトシャッフルの巡回と位数 =====
  // n 枚（偶数）の位置の置換。dest[i] は上から i 番目（0始まり）の札が移る位置
  function shufflePositions(n, out) {
    const h = n / 2;
    const dest = new Array(n);
    for (let i = 0; i < h; i++) {
      dest[i] = out ? 2 * i : 2 * i + 1;
      dest[h + i] = out ? 2 * i + 1 : 2 * i;
    }
    return dest;
  }

  // 置換を巡回（位置の並び、0始まり）に分ける
  function cyclesOf(dest) {
    const seen = new Array(dest.length).fill(false);
    const cycles = [];
    for (let i = 0; i < dest.length; i++) {
      if (seen[i]) continue;
      const cycle = [];
      for (let j = i; !seen[j]; j = dest[j]) {
        seen[j] = true;
        cycle.push(j);
      }
      cycles.push(cycle);
    }
    return cycles;
  }

  // 2 の法 m での位数（2^k ≡ 1 (mod m) となる最小の k）。m は奇数
  function orderOfTwo(m) {
    if (m === 1) return 1;
    let x = 2 % m;
    let k = 1;
    while (x !== 1) {
      x = (x * 2) % m;
      k++;
    }
    return k;
  }

  // n 枚（偶数）のシャッフルの位数。アウトは 2 の法 (n−1) での位数、インは法 (n+1)（Diaconis・Graham・Kantor の Lemma 1）
  const shuffleOrder = (n, out) => orderOfTwo(out ? n - 1 : n + 1);

  // ===== 自己逆の Hill 行列（2×2、mod 26） =====
  let hillCache = null;

  // 可逆な2×2行列の数と、そのうち A² ≡ I のもの（26⁴ 通りを全部調べる。結果は覚えておく）
  function hill2Census() {
    if (!hillCache) {
      let invertible = 0;
      const involutory = [];
      for (let a = 0; a < 26; a++) {
        for (let b = 0; b < 26; b++) {
          for (let c = 0; c < 26; c++) {
            for (let d = 0; d < 26; d++) {
              if (gcd(det2([[a, b], [c, d]], 26), 26) !== 1) continue;
              invertible++;
              const sq = mulMod([[a, b], [c, d]], [[a, b], [c, d]], 26);
              if (sq[0][0] === 1 && sq[0][1] === 0 && sq[1][0] === 0 && sq[1][1] === 1) involutory.push([[a, b], [c, d]]);
            }
          }
        }
      }
      hillCache = { invertible, involutory };
    }
    return hillCache;
  }

  // 英字だけを大文字にして並べる（奇数個なら X を足す）
  function hillNormalize(text) {
    const letters = codePoints(String(text).toUpperCase()).filter((ch) => ch >= 'A' && ch <= 'Z');
    const padded = letters.length % 2 === 1;
    if (padded) letters.push('X');
    return { text: letters.join(''), padded };
  }

  // 2文字ずつ縦ベクトルにして A を掛ける
  function hillApply(A, text) {
    const v = toMap(hillNormalize(text).text);
    let out = '';
    for (let i = 0; i < v.length; i += 2) {
      out += ALPHABET[(A[0][0] * v[i] + A[0][1] * v[i + 1]) % 26] + ALPHABET[(A[1][0] * v[i] + A[1][1] * v[i + 1]) % 26];
    }
    return out;
  }

  globalThis.InvolutionCore = {
    codePoints,
    atbash,
    rot13,
    rot47,
    reverse,
    swapPairs,
    transpose,
    sameMatrix,
    bitNot,
    toBinary,
    parseByteInput,
    byteGlyph,
    parseIntIn,
    FEISTEL_KEYS,
    feistelF,
    feistelRound,
    feistelHalf,
    feistelSteps,
    caesar,
    shuffle,
    ORDER_KINDS,
    orderTransform,
    orderInputError,
    orderOf,
    ALPHABET,
    mapToString,
    parseAlphabet,
    analyzePermutation,
    ROTOR_I,
    UKW_B,
    PRESETS,
    randomInvolution,
    involutionCount,
    fixedPointFreeCount,
    enigmaMapAt,
    enigma,
    graphemes,
    reverseBy,
    wellFormed,
    KEY_BYTES,
    utf8,
    toHex,
    xorBytes,
    twoTimePad,
    HILL_INVOLUTORY,
    mulMod,
    det2,
    invertMap,
    conjugate,
    composeMaps,
    shufflePositions,
    cyclesOf,
    orderOfTwo,
    shuffleOrder,
    hill2Census,
    hillNormalize,
    hillApply
  };
})();
