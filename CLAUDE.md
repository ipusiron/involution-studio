# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Involution Studio is a lightweight educational hub for exploring involution transforms - operations that return to the original state when applied twice (f(f(x)) = x). Part of the "生成AIで作るセキュリティツール100" (100 Security Tools with Generative AI) project, Day051.

**Live demo**: https://ipusiron.github.io/involution-studio/

## Development Commands

Static site with no build process and no dependencies.

```bash
npm test                    # node --test (Node.js 22+), no dependencies
python -m http.server 8000  # serve locally (index.html also works from file://)
```

## Code Architecture

- `index.html` - 4 tab panels (basics / substitution / transposition / bitwise) with accordions. No `style` attributes, no inline scripts or handlers. Static text has `data-i18n` keys whose Japanese text must equal the dictionary (tested)
- `script.js` - DOM layer only. Each demo keeps one state object and redraws from it with a `render()` function; `renders` are all re-run on language switch
- `js/involution-core.js` - pure logic (`globalThis.InvolutionCore`): `atbash` (keeps case and non-letters), `rot13`, `rot47`, `reverse` and `swapPairs` (by code point), `transpose`, `bitNot`, `parseByteInput` (char U+0000–U+00FF or decimal 0–255), `byteGlyph`, `parseIntIn`, Feistel (`feistelF`, `feistelRound`, `feistelHalf`, `feistelSteps`). Second release: order (`caesar`, `shuffle`, `orderTransform`, `orderOf`), checker (`parseAlphabet`, `analyzePermutation`, `PRESETS`, `randomInvolution`, `involutionCount`, `fixedPointFreeCount`), simplified Enigma (`ROTOR_I` + `UKW_B`, `enigmaMapAt`, `enigma`), units of reversal (`reverseBy`, `graphemes`, `wellFormed`), XOR (`utf8`, `xorBytes`, `twoTimePad`, `KEY_BYTES` 256) and the self-inverse Hill example (`HILL_INVOLUTORY`)
- `js/messages.js` - Japanese and English dictionaries with the same keys (`InvolutionMessages.t(key, vars, lang)`)
- `js/i18n.js` - language detection (`?lang=` → saved → browser) and `data-i18n` replacement
- `js/theme-init.js` / `js/theme.js` - theme follows the OS until toggled; localStorage access is always in `try`
- `styles.css` - color tokens on `:root`, dark via `prefers-color-scheme` and `[data-theme="dark"]` (same values)

### Feistel demo

`feistelSteps(value, keys)` returns all 10 steps: 4 encryption rounds (L, R) → (R, L ⊕ F(R, k)), swap, 4 rounds on the same circuit with the keys reversed, swap. The toy F is `((R + k) % 16) ^ (R >> 2)` on 4-bit halves. Do not claim that repeating rounds with the same key returns to the original (only 50 of 4096 do; tested).

## Hub Architecture

This repo links to dedicated tools for deeper exploration:
- ROT13 Encoder: https://ipusiron.github.io/rot13-encoder/
- QuickROT47: https://ipusiron.github.io/quick-rot47/
- Columnar CipherLab: https://ipusiron.github.io/columnar-cipherlab/
- Mirror CipherLab: https://ipusiron.github.io/mirror-cipherlab/
- Beaufort CipherLab: https://ipusiron.github.io/beaufort-cipherlab/ (reciprocal: c = k − p)
- Hill CipherLab: https://ipusiron.github.io/hill-cipherlab/ (self-inverse matrix example)
- OTP Animation: https://ipusiron.github.io/otp-animation/ (XOR)

Do not link Porta CipherLab as a reciprocal cipher: it implements Porta's digraphic cipher (pairs → 3-digit codes), not the reciprocal polyalphabetic Porta.

Keep this repository lightweight. Heavy implementations belong in separate tool repositories.

## Security Considerations

- CSP in `<meta>`: `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'` (no `unsafe-inline`)
- All output is built with DOM APIs and `textContent` (no `innerHTML`; tested)
- External links use `rel="noopener noreferrer"`; referrer policy is `no-referrer`

## Tests

- `test/core.test.js` - round trips over ASCII/Japanese/emoji, known answers, all 256 NOT values, Feistel steps for 256 values × 46 key sets, half round for all 4096
- `test/explore.test.js` - orders (shuffles against a separate reference), checker and presets, involution counts (enumeration up to 7), simplified Enigma at all 26 positions against a separate reference, units of reversal (Hangul jamo GB6 case), XOR and key reuse, Hill example
- `test/html.test.js` - CSP, ARIA (tabs, accordions), labels, dictionary agreement, ids used by script.js, no innerHTML/style writes, guarded localStorage
- `test/contrast.test.js` - text 4.5:1 and field borders 3:1 in light and dark, 44px controls, 16px inputs
- `test/messages.test.js`, `test/i18n.test.js` - dictionaries and language selection
- `test/readme.test.js` - both READMEs (same headings), YAML structure, example, order, checker and Feistel tables and the Enigma example recomputed from the core, directory tree, images (6 screenshots each)
- `test/format.test.js` - line length, LF, no control characters

README numbers are recomputed by tests — update them from the core, not by hand. README states only what is true for the current version. Screenshots are taken with `business/research/try100_audit/impl/shots/day051_shots.py` in the ipusiron-work repository.
