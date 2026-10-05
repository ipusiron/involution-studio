// Involution Studio - 画面の処理（DOM）。計算は js/involution-core.js、文言は js/messages.js に置く
// 各デモは状態を1つ持ち、render() で状態から画面を描き直す（言語を切り替えたときも同じ関数で描き直す）
(() => {
  'use strict';

  const C = globalThis.InvolutionCore;
  const I18n = globalThis.InvolutionI18n;
  const Theme = globalThis.InvolutionTheme;
  const t = (key, vars) => globalThis.InvolutionMessages.t(key, vars);
  const $ = (id) => document.getElementById(id);
  const renders = [];

  function el(tag, className, text) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // ===== タブ（矢印キー・Home・End で移動、選んだタブだけ tabindex=0） =====
  const tabs = [...document.querySelectorAll('.tab-btn')];

  function selectTab(tab, focus) {
    for (const b of tabs) {
      const on = b === tab;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      $(b.getAttribute('aria-controls')).hidden = !on;
    }
    if (focus) tab.focus();
  }

  tabs.forEach((b, i) => {
    b.addEventListener('click', () => selectTab(b, false));
    b.addEventListener('keydown', (e) => {
      const target = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (target === undefined) return;
      e.preventDefault();
      selectTab(tabs[(target + tabs.length) % tabs.length], true);
    });
  });

  // ===== アコーディオン（開閉は独立。aria-expanded と hidden を同じに保つ） =====
  for (const header of document.querySelectorAll('.accordion-header')) {
    header.addEventListener('click', () => {
      const open = header.getAttribute('aria-expanded') !== 'true';
      header.setAttribute('aria-expanded', open ? 'true' : 'false');
      $(header.getAttribute('aria-controls')).hidden = !open;
    });
  }

  // ===== 文字列のデモ（変換・結果をもう一度・クリア） =====
  // history[0] が最初の入力、history[n] が n 回適用したあとの文字列
  function textDemo(id, apply, extra) {
    const input = $(`${id}-input`);
    const result = $(`${id}-result`);
    const status = $(`${id}-status`);
    const run = $(`${id}-run`);
    const again = $(`${id}-again`);
    const state = { history: [] };

    function render() {
      const h = state.history;
      const n = h.length - 1;
      again.disabled = n < 1;
      result.textContent = n >= 1 ? h[n] : '';
      status.classList.remove('ok');
      if (n < 1) {
        status.textContent = '';
      } else if (n === 1) {
        status.textContent = t('demo.once', { again: again.textContent });
      } else if (h[n] === h[0]) {
        status.textContent = t('demo.back', { n, text: h[0] === '' ? t('demo.empty') : h[0] });
        status.classList.add('ok');
      } else {
        status.textContent = t('demo.count', { n });
      }
      if (extra) extra(h);
    }

    const step = (from) => {
      state.history.push(apply(from));
      render();
    };
    run.addEventListener('click', () => {
      state.history = [input.value];
      step(input.value);
    });
    again.addEventListener('click', () => {
      if (state.history.length > 1) step(state.history[state.history.length - 1]);
    });
    $(`${id}-clear`).addEventListener('click', () => {
      input.value = '';
      state.history = [];
      render();
      input.focus();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) run.click();
    });
    renders.push(render);
    render();
    // 設定を変えたときに、前の結果を消す
    return {
      reset() {
        state.history = [];
        render();
      }
    };
  }

  // Atbash の変換表（26組）。直前の変換で使った文字を強調する
  const mapGrid = $('atbash-map');
  for (let c = 65; c <= 90; c++) {
    const ch = String.fromCharCode(c);
    const cell = el('div', 'map-cell', `${ch}↔${C.atbash(ch).output}`);
    cell.dataset.letter = ch;
    mapGrid.append(cell);
  }

  textDemo('atbash', (s) => C.atbash(s).output, (h) => {
    const used = new Set(h.length > 1 ? C.atbash(h[h.length - 2]).used : []);
    for (const cell of mapGrid.children) cell.classList.toggle('used', used.has(cell.dataset.letter));
  });
  textDemo('rot13', C.rot13);
  textDemo('rot47', C.rot47);

  // 文字反転: 単位（コードポイント・コード単位・書記素）を選べる。適用した回ごとの「前→後」を並べる（多すぎるときは最後の8回）
  const unitSelect = $('reverse-unit');
  if (!C.graphemes('a')) unitSelect.querySelector('option[value="grapheme"]').disabled = true;
  const reverseDemo = textDemo('reverse', (s) => C.reverseBy(s, unitSelect.value), (h) => {
    const list = $('reverse-steps');
    const items = [];
    for (let i = Math.max(1, h.length - 8); i < h.length; i++) items.push(el('li', null, t('reverse.step', { n: i, from: h[i - 1], to: h[i] })));
    list.replaceChildren(...items);
    const warn = $('reverse-warn');
    const n = h.length - 1;
    let message = '';
    if (n >= 1 && !C.wellFormed(h[n])) message = t('reverse.warnBroken', { n });
    else if (n >= 2 && n % 2 === 0 && h[n] !== h[0]) message = t('reverse.notBack', { n });
    warn.textContent = message;
    warn.hidden = !message;
  });
  unitSelect.addEventListener('change', () => reverseDemo.reset());
  // 例の文字列（文字コードから組み立てる）
  const SAMPLES = {
    emoji: `A${String.fromCodePoint(0x1f600)}B`,
    flags: String.fromCodePoint(0x1f1ef, 0x1f1f5, 0x1f1fa, 0x1f1f8),
    jamo: String.fromCharCode(0x1161, 0x1100)
  };
  for (const b of document.querySelectorAll('[data-sample]')) {
    b.addEventListener('click', () => {
      $('reverse-input').value = SAMPLES[b.dataset.sample];
      reverseDemo.reset();
    });
  }

  // ペア交換: 直前に入れ替えたペアと、残した1文字
  textDemo('pairs', (s) => C.swapPairs(s).output, (h) => {
    const detail = $('pairs-detail');
    if (h.length < 2) {
      detail.textContent = '';
      return;
    }
    const r = C.swapPairs(h[h.length - 2]);
    const parts = [t('pairs.list', { list: r.pairs.map(([a, b]) => `${a}${b}→${b}${a}`).join(' ') })];
    if (r.odd !== null) parts.push(t('pairs.odd', { c: r.odd }));
    detail.textContent = parts.join(' / ');
  });

  // ===== 何回で元に戻るか（位数） =====
  const order = { result: null, error: null };
  const orderKind = $('order-kind');

  function renderOrder() {
    $('order-k-field').hidden = orderKind.value !== 'caesar';
    const error = $('order-error');
    error.hidden = !order.error;
    error.textContent = order.error ? t(`order.err.${order.error}`) : '';
    const result = $('order-result');
    const list = $('order-states');
    result.classList.remove('ok');
    if (!order.result) {
      result.textContent = '';
      list.replaceChildren();
      return;
    }
    const { order: n, states } = order.result;
    if (n === null) result.textContent = t('order.resultNone', { n: states.length - 1 });
    else if (n === 1) result.textContent = t('order.resultSame');
    else result.textContent = t(n === 2 ? 'order.resultInv' : 'order.resultNot', { n });
    result.classList.toggle('ok', n === 2);
    // 途中の状態（多いときは最初の6つと最後の6つ）
    const shown = states.length > 14 ? [...states.slice(0, 6).map((s, i) => [i, s]), null, ...states.slice(-6).map((s, i) => [states.length - 6 + i, s])]
      : states.map((s, i) => [i, s]);
    list.replaceChildren(...shown.map((x) => el('li', null, x ? t('order.state', { n: x[0], s: x[1] }) : t('order.skip', { from: 6, to: states.length - 7 }))));
  }

  $('order-run').addEventListener('click', () => {
    const kind = orderKind.value;
    const text = $('order-input').value;
    const k = kind === 'caesar' ? C.parseIntIn($('order-k').value, 25) : 0;
    order.error = kind === 'caesar' && !k ? 'k' : C.orderInputError(kind, text);
    order.result = order.error ? null : C.orderOf(C.orderTransform(kind, k), text);
    renderOrder();
  });
  // 変換の種類を変えたら、前の結果を消す
  orderKind.addEventListener('change', () => {
    order.result = null;
    order.error = null;
    renderOrder();
  });
  $('order-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) $('order-run').click();
  });
  renders.push(renderOrder);

  // ===== 行列の転置（いまの行列を持ち、元の行列と比べて表示を決める） =====
  const M0 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const matrix = { current: M0, count: 0 };

  function renderMatrix() {
    $('matrix-body').replaceChildren(...matrix.current.map((row) => {
      const tr = el('tr');
      for (const v of row) tr.append(el('td', null, String(v)));
      return tr;
    }));
    const original = C.sameMatrix(matrix.current, M0);
    $('matrix-label').textContent = t(original ? 'matrix.original' : 'matrix.transposed', { n: matrix.count });
    const hint = $('matrix-hint');
    hint.textContent = t(matrix.count === 0 ? 'matrix.hint0' : original ? 'matrix.hint2' : 'matrix.hint1');
    hint.classList.toggle('ok', matrix.count > 0 && original);
  }

  $('matrix-transpose').addEventListener('click', () => {
    matrix.current = C.transpose(matrix.current);
    matrix.count++;
    renderMatrix();
  });
  $('matrix-reset').addEventListener('click', () => {
    matrix.current = M0;
    matrix.count = 0;
    renderMatrix();
  });
  renders.push(renderMatrix);
  renderMatrix();

  // ===== ビット反転 =====
  const not = { history: [], error: null };

  function bitBox(titleKey, v) {
    const box = el('div', 'bit-box');
    box.append(el('div', 'bit-title', t(titleKey)), el('div', 'bit-value', `${v} (${C.byteGlyph(v)})`), el('div', 'bit-bits', C.toBinary(v, 8)));
    return box;
  }

  function renderNot() {
    const h = not.history;
    const n = h.length - 1;
    const error = $('not-error');
    error.hidden = !not.error;
    error.textContent = not.error ? t(`not.err.${not.error}`) : '';
    $('not-again').disabled = n < 1;
    const display = $('not-display');
    const status = $('not-status');
    status.classList.remove('ok');
    if (n < 1) {
      display.replaceChildren();
      status.textContent = '';
      return;
    }
    display.replaceChildren(bitBox('not.before', h[n - 1]), el('div', 'bit-arrow', '→'), bitBox('not.after', h[n]));
    const line = t('not.explain', { n, from: C.toBinary(h[n - 1], 8), to: C.toBinary(h[n], 8) });
    if (n >= 2 && h[n] === h[0]) {
      status.textContent = `${line} — ${t('not.back', { n, v: h[0] })}`;
      status.classList.add('ok');
    } else {
      status.textContent = line;
    }
  }

  $('not-run').addEventListener('click', () => {
    const r = C.parseByteInput($('not-mode').value, $('not-input').value);
    not.error = r.ok ? null : r.error;
    not.history = r.ok ? [r.value, C.bitNot(r.value)] : [];
    renderNot();
  });
  $('not-again').addEventListener('click', () => {
    if (not.history.length > 1) not.history.push(C.bitNot(not.history[not.history.length - 1]));
    renderNot();
  });
  $('not-clear').addEventListener('click', () => {
    $('not-input').value = '';
    not.history = [];
    not.error = null;
    renderNot();
  });
  // 入力の種類を変えたら、読める値は新しい表記へ直し、前の結果は消す（古い結果を残さない）
  $('not-mode').addEventListener('change', (e) => {
    const input = $('not-input');
    const from = e.target.value === 'char' ? 'byte' : 'char';
    const r = C.parseByteInput(from, input.value);
    if (r.ok) {
      const glyph = C.byteGlyph(r.value);
      input.value = e.target.value === 'byte' ? String(r.value) : glyph.startsWith('U+') ? '' : glyph;
    }
    not.history = [];
    not.error = null;
    renderNot();
  });
  $('not-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) $('not-run').click();
  });
  renders.push(renderNot);

  // ===== Feistel（暗号化 → 入れ替え → 鍵を逆順にして同じ回路 → 入れ替え） =====
  const feistel = { plan: null, value: 0, keys: [], done: 0, error: null, half: false };
  const keyInputs = [1, 2, 3, 4].map((i) => $(`feistel-k${i}`));
  const nib = (v) => C.toBinary(v, 4);

  function readFeistel() {
    const value = C.parseIntIn($('feistel-value').value, 255);
    const keys = keyInputs.map((input) => C.parseIntIn(input.value, 15));
    if (value === null) return { error: 'feistel.errValue' };
    if (keys.some((k) => k === null)) return { error: 'feistel.errKey' };
    return { value, keys };
  }

  function resetFeistel() {
    const r = readFeistel();
    feistel.error = r.error || null;
    if (!r.error) {
      feistel.value = r.value;
      feistel.keys = r.keys;
      feistel.plan = C.feistelSteps(r.value, r.keys);
    }
    feistel.done = 0;
    feistel.half = false;
    renderFeistel();
  }

  function nibbleBox(labelKey, v) {
    const box = el('div', 'nibble');
    box.append(el('div', null, t(labelKey)), el('div', 'nibble-bits', nib(v)), el('div', 'note', String(v)));
    return box;
  }

  function stepLabel(s, i) {
    if (s.phase === 'swap') return t('feistel.swap');
    return t(s.phase === 'enc' ? 'feistel.enc' : 'feistel.dec', { n: s.round, i });
  }

  function renderFeistel() {
    const error = $('feistel-error');
    error.hidden = !feistel.error;
    error.textContent = feistel.error ? t(feistel.error) : '';
    const steps = feistel.plan ? feistel.plan.steps : [];
    const total = steps.length;
    const blocked = Boolean(feistel.error) || !feistel.plan;
    $('feistel-next').disabled = blocked || feistel.done >= total;
    $('feistel-all').disabled = blocked || feistel.done >= total;
    $('feistel-half').disabled = blocked;
    const status = $('feistel-status');
    status.classList.remove('ok');
    if (blocked) {
      $('feistel-progress').textContent = '';
      $('feistel-state').replaceChildren();
      $('feistel-trace').replaceChildren();
      $('feistel-half-result').textContent = '';
      status.textContent = '';
      return;
    }
    const done = feistel.done;
    const now = done ? steps[done - 1].after : { L: feistel.value >> 4, R: feistel.value & 15 };
    $('feistel-progress').textContent = t('feistel.progress', { i: done, n: total });
    $('feistel-state').replaceChildren(nibbleBox('feistel.left', now.L), nibbleBox('feistel.right', now.R));

    const rounds = feistel.keys.length;
    if (done === 0) {
      status.textContent = t('feistel.start');
    } else {
      const s = steps[done - 1];
      if (s.phase === 'enc' && s.round === rounds) {
        status.textContent = t('feistel.statusCipher', { c: feistel.plan.cipher, bin: C.toBinary(feistel.plan.cipher, 8) });
      } else if (s.phase === 'enc') {
        status.textContent = t('feistel.statusEnc', { n: s.round, f: nib(s.f) });
      } else if (s.phase === 'swap' && done < total) {
        status.textContent = t('feistel.statusSwap', { keys: [...feistel.keys].reverse().join(', ') });
      } else if (s.phase === 'dec') {
        status.textContent = t('feistel.statusDec', { n: s.round, k: s.key });
      } else {
        status.textContent = t('feistel.statusDone', { v: feistel.plan.plain });
        status.classList.add('ok');
      }
    }

    $('feistel-trace').replaceChildren(...steps.slice(0, done).map((s, i) => {
      const tr = el('tr', s.phase === 'swap' ? 'swap' : null);
      tr.append(
        el('td', null, `${i + 1}. ${stepLabel(s, i + 1)}`),
        el('td', 'mono', s.phase === 'swap' ? '—' : String(s.key)),
        el('td', 'mono', s.phase === 'swap' ? '—' : nib(s.f)),
        el('td', 'mono', `(${nib(s.after.L)}, ${nib(s.after.R)})`)
      );
      return tr;
    }));

    const half = $('feistel-half-result');
    half.classList.remove('ok');
    if (feistel.half) {
      const L0 = feistel.value >> 4;
      const R0 = feistel.value & 15;
      const once = C.feistelHalf(L0, R0, feistel.keys[0]);
      const twice = C.feistelHalf(once.L, once.R, feistel.keys[0]);
      const vars = { l0: nib(L0), r0: nib(R0), l1: nib(once.L), r1: nib(once.R), l2: nib(twice.L), r2: nib(twice.R) };
      half.textContent = `${t('feistel.halfResult', vars)} — ${t('feistel.halfBack')}`;
      half.classList.add('ok');
    } else {
      half.textContent = '';
    }
  }

  $('feistel-next').addEventListener('click', () => {
    if (feistel.plan && feistel.done < feistel.plan.steps.length) feistel.done++;
    renderFeistel();
  });
  $('feistel-all').addEventListener('click', () => {
    if (feistel.plan) feistel.done = feistel.plan.steps.length;
    renderFeistel();
  });
  $('feistel-reset').addEventListener('click', resetFeistel);
  $('feistel-half').addEventListener('click', () => {
    feistel.half = true;
    renderFeistel();
  });
  for (const input of [$('feistel-value'), ...keyInputs]) input.addEventListener('input', resetFeistel);
  renders.push(renderFeistel);

  // ===== テーマ・言語・初期表示 =====
  const themeBtn = $('btn-theme');
  themeBtn.addEventListener('click', () => Theme.toggle(themeBtn));

  function applyLanguage() {
    I18n.applyStaticText();
    Theme.refresh(themeBtn);
    for (const render of renders) render();
  }

  // 切り替えたら、URL に ?lang= があればそれも書き換える（再読み込みで元の言語に戻らないように）
  $('btn-lang').addEventListener('click', () => {
    I18n.set(I18n.lang === 'ja' ? 'en' : 'ja');
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', I18n.lang);
      history.replaceState(null, '', url);
    }
    applyLanguage();
  });

  I18n.init();
  resetFeistel();
  applyLanguage();
})();
