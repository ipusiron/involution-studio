# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Involution Studio is a lightweight educational hub for exploring involution transforms - cryptographic operations that return to the original state when applied twice (f(f(x)) = x). Part of the "生成AIで作るセキュリティツール100" (100 Security Tools Created with Generative AI) project.

**Live demo**: https://ipusiron.github.io/involution-studio/

## Development Commands

This is a static site with no build process:

```bash
# Serve locally (any static server)
python -m http.server 8000
# or
npx serve .
```

## Code Architecture

### File Structure
- **index.html** - Main HTML with 4 tab panels (基礎/換字式/転置式/ビット反転式), accordion UI, and inline demo markup
- **script.js** - All demo logic, event handlers, theme toggle, and state management
- **styles.css** - CSS variables for dark/light themes, responsive layout, accordion/tab styling

### Key Patterns

**Tab System**: Uses `aria-controls` to link buttons to panels. `activateTab(id)` toggles the `active` class.

**Accordion**: Each `.accordion-item` has a header button with `aria-expanded` that toggles `.accordion-content.active`.

**Demo State**: Each demo maintains local state (e.g., `currentMatrix`, `feistelState`) and updates DOM via dedicated display functions.

**Input Sanitization**: All user inputs are sanitized via:
- `sanitizeText()` for HTML encoding
- Regex patterns to strip dangerous characters (`/[<>"'&]/g`)
- `maxlength` and `pattern` attributes on inputs

### Demo Implementations (script.js)

| Demo | Functions | State |
|------|-----------|-------|
| Atbash | `transformAtbash()`, `clearAtbash()` | Stateless |
| String Reverse | `reverseString()`, `clearReverse()` | Stateless |
| Pair Swap | `swapPairs()`, `clearPairs()` | Stateless |
| Matrix Transpose | `transposeMatrix()`, `displayMatrix()`, `resetMatrix()` | `currentMatrix`, `transposeCount` |
| Bitwise NOT | `flipBits()`, `clearBitwise()` | Stateless |
| Feistel | `feistelRound()`, `displayFeistelState()`, `resetFeistel()` | `feistelState` object |

## Hub Architecture

This repo serves as a **hub** linking to dedicated tools for deeper exploration:
- ROT13 Encoder: https://ipusiron.github.io/rot13-encoder/
- QuickROT47: https://ipusiron.github.io/quick-rot47/
- Columnar CipherLab: https://ipusiron.github.io/columnar-cipherlab/

Keep this repository lightweight. Heavy implementations belong in separate tool repositories.

## Security Considerations

- CSP in `<meta>` tag restricts `script-src 'self'` and `connect-src 'none'`
- No inline event handlers (all via `addEventListener` in script.js)
- External links use `rel="noopener noreferrer"`
- Input validation with maxlength, pattern attributes, and runtime sanitization