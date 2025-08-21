# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Involution Studio is a lightweight educational hub for exploring involution transforms - cryptographic operations that return to the original state when applied twice (f(f(x)) = x). The project demonstrates various involution types through visual mini-demos and provides links to dedicated tools.

## Key Architecture

- **Single-page HTML application** (index.html) with embedded CSS and vanilla JavaScript
- **No build process or dependencies** - pure HTML/CSS/JS for simplicity
- **Tab-based interface** with four main sections:
  - インボリューション基礎 (Involution Basics)
  - 換字式 (Substitution type)
  - 転置式 (Transposition type) 
  - ビット反転式 (Bitwise type)
- **Japanese-first content** with technical terminology in both Japanese and English

## Development Commands

This is a static site with no build process:

```bash
# Serve locally (any static server will work)
python -m http.server 8000
# or
npx serve .

# Deploy to GitHub Pages
# The site is deployed to: https://ipusiron.github.io/involution-studio/
```

## Important Context

- This is part of the "生成AIで作るセキュリティツール100" (100 Security Tools Created with Generative AI) project
- The repository serves as a **hub** - heavy implementations should link to dedicated tool repositories
- Links to existing tools include:
  - ROT13 Encoder: https://ipusiron.github.io/rot13-encoder/
  - QuickROT47: https://ipusiron.github.io/quick-rot47/
  - Columnar CipherLab: https://ipusiron.github.io/columnar-cipherlab/
- All basic lightweight demos have been implemented and are functional

## Current Implementation Status

### Completed Features
- **Accordion-based UI** with tab switching between 4 main sections
- **Dark/Light mode toggle** with localStorage persistence
- **Security hardening** (CSP, input sanitization, external link protection)
- **Lightweight demos implemented**:
  - Atbash cipher with character mapping visualization and real-time highlighting
  - String reversal with step-by-step explanation
  - Pair swapping with visual process display
  - 3x3 Matrix transpose with visual representation
  - Bitwise NOT with binary visualization (char/byte modes)
  - Feistel structure with 4-round demonstration, progress tracking, and detailed UI

### Security Features
- Content Security Policy (CSP) implementation
- Input sanitization for XSS prevention
- External links with `rel="noopener noreferrer"`
- Maxlength restrictions on input fields
- Pattern validation for specific input types

## Future Enhancement Ideas

The basic implementation is complete. The following are potential improvement areas for future development:

### 🎨 UI/UX Enhancements
- **Display Format Consistency**: Standardize progress indicators across all demos (currently only Feistel has detailed progress bars)
- **Visual Feedback Enhancement**: Add animation effects to visualize transformation processes
- **Mobile Optimization**: Improve matrix display and Feistel block visualization on mobile devices
- **Touch Interaction**: Optimize button sizes and interactions for mobile devices

### ⚙️ Functional Improvements  
- **Demo Interconnection**: Enable data transfer between demos, standardize 8-bit representation across all demos
- **Enhanced Input Guidance**: More detailed real-time input requirements and validation feedback
- **Progressive Learning Support**: Add beginner/intermediate/advanced mode switching with contextual hints

### 🔧 Technical Improvements
- **Performance Optimization**: Implement debouncing for real-time updates, optimize large dataset processing
- **Error Handling**: More detailed error messages with suggested solutions and auto-correction
- **Accessibility Enhancement**: Complete keyboard-only navigation, improved screen reader support, color-blind friendly design

### 📚 Educational Value Enhancement
- **Mathematical Context**: Add group theory explanations and real-world application examples  
- **Learning Path Guidance**: Provide recommended learning sequences and comprehension checks
- **External Resource Integration**: Link to related mathematics/cryptography learning resources

### 🛡️ Code Quality & Maintenance
- **TypeScript Migration**: Consider TypeScript for better type safety
- **Testing Framework**: Add unit tests for demo logic
- **Documentation**: Comprehensive code documentation and API references
- **Internationalization**: English interface and multi-language support foundation

### Priority Recommendations
1. **UI Consistency**: Extend Feistel-level detailed progress display to other demos
2. **Visual Process Animation**: Make the "apply twice to return" concept more intuitive
3. **Mobile Experience**: Optimize responsive design for complex visualizations

These enhancements would significantly improve educational effectiveness while maintaining the lightweight, hub-focused nature of the tool.