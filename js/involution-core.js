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
    feistelSteps
  };
})();
