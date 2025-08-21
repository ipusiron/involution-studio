<!--
---
title: Involution Studio
category: classical-cryptography
difficulty: 1
description: Lightweight hub to explore "apply twice to get back" transforms with visual mini-demos and links to dedicated tools.
tags: [involution, cryptography, education, visualization]
demo: https://ipusiron.github.io/involution-studio/
---
-->

# Involution Studio - インボリューション総合体験ハブツール

![GitHub Repo stars](https://img.shields.io/github/stars/ipusiron/involution-studio?style=social)
![GitHub forks](https://img.shields.io/github/forks/ipusiron/involution-studio?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/ipusiron/involution-studio)
![GitHub license](https://img.shields.io/github/license/ipusiron/involution-studio)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://ipusiron.github.io/involution-studio/)

「2回適用で元に戻る」という処理である、インボリューション（"involution"）を「軽量デモ＋ビジュアル重視」で直感理解し、個別ツールに誘導するハブツールです。

## 🌐 デモページ

👉 **[https://ipusiron.github.io/involution-studio/](https://ipusiron.github.io/involution-studio/)**

ブラウザーで直接お試しいただけます。

---

## 📸 スクリーンショット

> ![ビット反転の軽量デモ](assets/screenshot.png)  
>
> *ビット反転の軽量デモ*

---

## 📑 各タブ
- インボリューション基礎
- 換字式（Atbash / ROT13 / ROT47）
- 転置式（文字反転 / ペア交換 / 行列転置）
- ビット反転式（Bitwise NOT / Feistel可視化の導入）

---

## 🔗 連携ツールとの関係

**軽量デモで理解 → 専用ツールで本格体験**

| 分野 | このツールでの軽量デモ | 専用ツール |
|------|---------------------|----------|
| **換字式** | Atbashの文字変換マッピング可視化 | [ROT13 Encoder](https://ipusiron.github.io/rot13-encoder/) |
| | ROT13/ROT47の概念紹介 | [QuickROT47](https://ipusiron.github.io/quick-rot47/) |
| **転置式** | 文字列反転の手順可視化 | *(準備中)* |
| | ペア交換の仕組み説明 | *(準備中)* |
| | 3×3行列転置のビジュアル表示 | *(準備中)* |
| **ビット反転式** | 8ビットNOT演算の二進表示 | *(準備中)* |
| | Feistel構造の4ラウンド体験 | [Columnar CipherLab](https://ipusiron.github.io/columnar-cipherlab/) |

---

## 🔄 インボリューションとは？

**インボリューション（involution）** とは「2回適用すると元に戻る変換」のことです。  
数学では **f(f(x)) = x** となる関数を指します。  
暗号の世界では「暗号化と復号が同じ手順になる」という性質として利用されます。  

---

## 🧮 数学的な側面
- 典型例：文字列の反転、行列の転置、数の符号反転（マイナスを2回）  
- 共通点は「2回適用すれば恒等写像に戻る」というシンプルな対称性  
- 抽象代数学や群論では「自己逆元（involution element）」として扱われます  

---

## 🔐 暗号における活用
- **古典暗号**  
  - Atbash暗号、ROT13、ROT47は、2回かけると平文に戻ります  
- **現代暗号**  
  - Feistel構造は「同じラウンド関数」で暗号化・復号できるよう設計されています  
- メリット  
  - 実装が簡単になる  
  - 復号用の逆関数を別途用意しなくてよい  
  - 回路やソフトのコストが減る  

---

## 🤖 AIやセキュリティとの関係
- **AIの世界**  
  - オートエンコーダーや生成モデルでは「対称的な構造」が品質や解釈性に影響  
  - データ変換を往復できる仕組みは、可逆性や理解可能性の確保に役立ちます  
- **セキュリティの世界**  
  - 「同じ処理を繰り返すと戻る」仕組みは直感的で教育向けに適しています  
  - ただし単純すぎるインボリューションは暗号強度が低いため、現代暗号では慎重に設計されています  

---

## 🎯 このツールの具体的な機能

### 📋 アコーディオン式UI
- **タブ切り替え**: インボリューション基礎 / 換字式 / 転置式 / ビット反転式
- **開閉自由**: 複数のアコーディオンを同時に開いて比較学習可能
- **レスポンシブ対応**: モバイルでも快適に操作できるデザイン

### 🧮 実装済みの軽量デモ

#### **換字式インボリューション**
- **Atbashデモ**: テキスト入力でA↔Z変換、使用文字のリアルタイムハイライト

#### **転置式インボリューション**  
- **文字列反転**: 入力文字列の逆順変換、2回適用での復元確認
- **ペア交換**: 隣接文字のペア単位交換、視覚的な交換過程表示
- **行列転置**: 3×3行列のリアルタイム転置、2回適用で元に戻る確認

#### **ビット反転式インボリューション**
- **ビットwise NOTデモ**: 文字/数値の8ビット表現とNOT演算の二進可視化  
- **Feistel構造デモ**: 8ビット値の4ラウンド変換、進行状況バーと詳細説明付き

### 🛡️ セキュリティ対応
- **CSP実装**: XSS攻撃対策のContent Security Policy
- **入力サニタイゼーション**: 危険文字の除去と適切な検証
- **外部リンク保護**: `rel="noopener noreferrer"`によるセキュリティ強化  

---

## 📁 ディレクトリー構成

```
involution-studio/
├── index.html          # メインHTML（アコーディオンUI + デモ機能）
├── styles.css          # CSS（ダークモード対応、レスポンシブ）
├── script.js           # JavaScript（デモロジック、セキュリティ対応済み）
├── README.md           # このファイル
├── CLAUDE.md           # AI開発用のプロジェクト説明
├── LICENSE             # MITライセンス
└── assets/             # スクリーンショット等
    └── screenshot.png  # ビット反転デモのスクリーンショット
```

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) をご覧ください。

---

## 🛠 このツールについて

本ツールは、「生成AIで作るセキュリティツール100」プロジェクトの一環として開発されました。  
このプロジェクトでは、AIの支援を活用しながら、セキュリティに関連するさまざまなツールを100日間にわたり制作・公開していく取り組みを行っています。

プロジェクトの詳細や他のツールについては、以下のページをご覧ください。  

🔗 [https://akademeia.info/?page_id=42163](https://akademeia.info/?page_id=42163)

