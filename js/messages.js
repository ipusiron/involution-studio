// 画面の文言（日本語・英語で同じキー）。t(key, vars, lang) で {name} を値に置き換える。globalThis.InvolutionMessages に置く
// 文中の **…** は太字、改行（\n）は改行として i18n.js が要素で組み立てる（HTML として解釈しない）
(() => {
  'use strict';

  const ja = {
    'ui.subtitle': 'インボリューション（2回適用すると元に戻る変換）を、換字式・転置式・ビット反転式の軽量デモで体験する学習ハブ',
    'ui.tabsLabel': '表示の切り替え',
    'ui.langButton': 'English',
    'ui.langLabel': 'Switch to English',
    'ui.repo': 'GitHubリポジトリ（ipusiron/involution-studio）',
    'ui.noscript': 'このページはJavaScriptで動きます。JavaScriptを有効にしてから開き直してください。',
    'theme.toDark': 'ダークモードに切り替える',
    'theme.toLight': 'ライトモードに切り替える',
    'tab.basics': 'インボリューション基礎',
    'tab.subst': '換字式',
    'tab.trans': '転置式',
    'tab.bits': 'ビット反転式',

    'basics.title': 'インボリューションとは',
    'basics.p1': 'インボリューション（involution）とは、同じ操作を2回繰り返すと元に戻る変換のことです。数学では**f(f(x)) = x**と書きます。',
    'basics.p2': 'もっとも身近な例は文字列の反転です。「HELLO」→「OLLEH」→「HELLO」のように、2回適用すると元に戻ります。'
      + '行列の転置、符号の反転、ビットの反転、Atbash・ROT13などの古典暗号も同じ性質を持ちます。',
    'basics.math.title': '数学的な例',
    'basics.math.body': 'インボリューションは「自分自身が逆関数」になっている関数です。\n'
      + '行列の転置は(Aᵀ)ᵀ = A、符号の反転は−(−x) = x、逆数は1/(1/x) = x（x ≠ 0）です。\n'
      + 'どれも、1回目の結果にもう一度同じ操作をすると、最初の値に戻ります。',
    'basics.crypto.title': '暗号での活用',
    'basics.crypto.body': 'インボリューションの暗号では、暗号化と復号が同じ手順になります。同じ回路・同じプログラムで両方を行えるので、実装を1つにまとめられます。\n'
      + 'AtbashはA↔Z、B↔Yのようにアルファベットを逆順に対応させ、ROT13は26文字の半分（13文字）、ROT47は94文字の半分（47文字）ずらします。どれも2回適用すると元に戻ります。\n'
      + 'Feistel構造は、構造全体はインボリューションではありませんが、鍵の順番を逆にするだけで、暗号化と同じ回路で復号できます。DESはこの性質を使っています（FIPS 46-3）。',
    'basics.safety.title': '安全性との関係',
    'basics.safety.body': 'Atbash・ROT13・ROT47には鍵がありません。方式を知っていれば誰でも同じ操作で元に戻せるので、秘密を守る暗号ではなく、ひと目で読めなくする（難読化）ための変換です。\n'
      + 'インボリューションであること自体は弱点ではありません。DESのようなFeistel構造の暗号も、同じ回路で暗号化と復号を行います。そうした暗号の安全性を支えているのは鍵です。',

    'subst.title': '換字式インボリューション',
    'subst.lead': '文字を別の文字に置き換える変換のうち、2回適用すると元に戻るものです。ここでは軽量デモを用意し、詳しくは各専用ツールへ案内します。',
    'atbash.title': 'Atbash（アトバシュ）',
    'atbash.body': 'Atbashは、アルファベットを逆順に対応させる換字です（A↔Z、B↔Y、…、M↔N）。同じ変換を2回適用すると元の文字に戻ります。\n'
      + 'もとはヘブライ文字の換字で、名前は最初と最後の文字（alef・taw）、2番目と後ろから2番目の文字（bet・shin）の組に由来します。'
      + 'エレミヤ書25章26節の「シェシャク」は、Atbashで「バベル」を表すと解釈されています。',
    'atbash.note': '英字以外（数字・記号・空白・日本語など）はそのまま残ります。大文字・小文字も保ちます。',
    'atbash.table': '変換表（直前の変換で使った文字を強調）',
    'rot13.title': 'ROT13',
    'rot13.body': 'ROT13は、A〜Zの26文字を半分（13文字）だけずらす換字です。半周ずらすので、2回適用すると元に戻り、暗号化と復号が同じ操作になります。',
    'rot13.link': '🔗 ROT13 Encoder',
    'rot47.title': 'ROT47',
    'rot47.body': 'ROT47は、ASCIIの33〜126（数字・記号・英字の94文字）を半分（47文字）だけずらします。ROT13より多くの文字を読みにくくでき、同じく2回適用で元に戻ります。'
      + '空白や日本語は変えません。',
    'rot47.link': '🔗 QuickROT47',

    'demo.text': 'テキスト',
    'demo.run': '変換',
    'demo.again': '結果をもう一度変換',
    'demo.clear': 'クリア',
    'demo.result': '結果',
    'demo.once': '1回適用しました。「{again}」を押すと、2回目を適用します。',
    'demo.back': '{n}回適用して、元の「{text}」に戻りました。',
    'demo.count': '{n}回適用しました。',
    'demo.empty': '（空の文字列）',

    'trans.title': '転置式インボリューション',
    'trans.lead': '並び順を入れ替える変換のうち、2回適用すると元に戻るものです。文字列や行列で確かめられます。',
    'reverse.title': '文字反転',
    'reverse.body': '文字列を逆順に並べ替える、もっとも基本的な転置です。「HELLO」→「OLLEH」→「HELLO」のように、2回適用で元に戻ります。',
    'reverse.note': 'Unicodeのコードポイント単位で並べ替えます。家族の絵文字や国旗のように、複数のコードポイントで1つに見える文字は、1回目で崩れて見えますが、2回目で元に戻ります。',
    'reverse.step': '{n}回目: 「{from}」→「{to}」',
    'reverse.run': '反転',
    'reverse.again': '結果をもう一度反転',
    'pairs.title': 'ペア交換',
    'pairs.body': '隣り合う2文字ずつを入れ替える操作です。「ABCD」→「BADC」→「ABCD」のように、2回適用で元に戻ります。文字数が奇数のときは、最後の1文字はそのまま残ります。',
    'pairs.shuffle': 'トランプのパーフェクトシャッフル（山を半分に分け、1枚ずつ交互に重ねる）は別の操作で、2回では元に戻りません。'
      + '52枚では、いちばん上の札が上に残る重ね方（アウトシャッフル）なら8回、2枚目に入る重ね方（インシャッフル）なら52回くり返して、ようやく元の順に戻ります（Diaconis・Graham・Kantor, 1983）。',
    'pairs.run': 'ペア交換',
    'pairs.again': '結果をもう一度ペア交換',
    'pairs.list': '入れ替えたペア: {list}',
    'pairs.odd': '最後の「{c}」はそのまま',
    'matrix.title': '行列の転置',
    'matrix.body': '行列の行と列を入れ替える操作です。転置を2回適用すると元の行列に戻ります。正方行列でなくても同じです。\n'
      + '鍵を使わない縦列転置式暗号で、正方形に並べた平文を列ごとに読み出すと、行列の転置と同じ並べ替えになります。',
    'matrix.transpose': '転置',
    'matrix.reset': 'リセット',
    'matrix.original': '元の行列（転置した回数: {n}）',
    'matrix.transposed': '転置した行列（転置した回数: {n}）',
    'matrix.hint0': '「転置」を押してください。',
    'matrix.hint1': 'もう一度転置すると、元の行列に戻ります。',
    'matrix.hint2': '元の行列に戻りました。',
    'matrix.caption': '3×3の行列',
    'columnar.title': '💡 実際の暗号ツールで試す',
    'columnar.body': '縦列転置式暗号でインボリューション性を確かめるには、鍵を使わず、平文が正方形をちょうど埋める長さ（足りなければ埋め字で調整）にしてください。',
    'columnar.link': '🔗 Columnar CipherLab',

    'bits.title': 'ビット反転式インボリューション',
    'bits.lead': 'ビット単位の変換で、2回適用すると元に戻るものです。Feistel構造では、同じ回路で復号できる仕組みを確かめます。',
    'not.title': 'ビット反転（Bitwise NOT）',
    'not.body': 'ビット反転（NOT演算）は、0を1に、1を0に変える、もっとも基本的なビット操作です。2回続けて適用すると、元のビットパターンに戻ります。',
    'not.input': '文字またはバイト値',
    'not.mode': '入力の種類',
    'not.modeChar': '文字（U+0000〜U+00FF）',
    'not.modeByte': 'バイト値（0〜255）',
    'not.run': 'ビット反転',
    'not.again': '結果をもう一度反転',
    'not.before': '反転前',
    'not.after': '反転後',
    'not.explain': '{n}回目の反転: {from} → {to}',
    'not.back': '{n}回反転して、元の値{v}に戻りました。',
    'not.err.empty': '値を入力してください。',
    'not.err.many': '文字は1文字だけ入力してください。',
    'not.err.wide': '8ビットに収まる文字（U+0000〜U+00FF）を入力してください。',
    'not.err.range': '0〜255の整数（10進数）を入力してください。',

    'feistel.title': 'Feistel構造',
    'feistel.body1': 'Feistel構造は、データを左右2つに分け、右半分と鍵から計算したF(R, k)を左半分にXORしてから、左右を入れ替える、という処理（ラウンド）を繰り返す暗号の骨組みです。',
    'feistel.body2': 'ラウンド関数Fに逆関数がなくても、暗号文の左右を入れ替え、鍵の順番を逆にして同じ回路に通し、最後にもう一度入れ替えると、元に戻ります。',
    'feistel.toy': 'このデモは、8ビットを左右4ビットに分けたおもちゃのFeistelです（F(R, k) = ((R + k) mod 16) XOR (R >> 2)）。',
    'feistel.value': '入力値（0〜255）',
    'feistel.keys': 'ラウンド鍵（0〜15）',
    'feistel.key': 'k{n}',
    'feistel.next': '次の手順へ',
    'feistel.all': '最後まで',
    'feistel.reset': 'はじめから',
    'feistel.progress': '手順 {i}/{n}',
    'feistel.colStep': '手順',
    'feistel.colKey': '鍵',
    'feistel.colF': 'F(R, k)',
    'feistel.colAfter': '終えたあとの(L, R)',
    'feistel.enc': '暗号化 ラウンド{n}',
    'feistel.swap': '左右を入れ替え',
    'feistel.dec': '復号 ラウンド{n}',
    'feistel.current': '現在の値',
    'feistel.left': '左（L）',
    'feistel.right': '右（R）',
    'feistel.start': '「次の手順へ」で、暗号化を1ラウンドずつ進めます。',
    'feistel.statusEnc': '暗号化ラウンド{n}: F(R, k{n}) = {f}を左半分にXORして、左右を入れ替えました。',
    'feistel.statusCipher': '暗号化が終わりました。暗号文は{c}（2進数{bin}）です。次は、同じ回路で復号します。',
    'feistel.statusSwap': '暗号文の左右を入れ替えました。ここから、鍵を逆順（{keys}）にして同じ回路に通します。',
    'feistel.statusDec': '復号ラウンド{n}: 鍵{k}で、暗号化と同じ処理をしました。',
    'feistel.statusDone': '元の値{v}に戻りました。暗号化と同じ回路を、鍵の順番だけ逆にして使いました。',
    'feistel.errValue': '入力値は0〜255の整数で入力してください。',
    'feistel.errKey': '鍵は0〜15の整数で入力してください。',
    'feistel.halfTitle': '入れ替えを除いた1ラウンドは、2回で戻る',
    'feistel.halfBody': 'ラウンドから左右の入れ替えを除いた(L, R) → (L ⊕ F(R, k), R)は、それ自体がインボリューションです。同じF(R, k)をもう一度XORすると打ち消し合うからです。',
    'feistel.halfRun': '入力値とk1で2回適用',
    'feistel.halfResult': '({l0}, {r0}) → ({l1}, {r1}) → ({l2}, {r2})',
    'feistel.halfBack': '2回目で元の(L, R)に戻りました。',
    'feistel.note': '同じ鍵で4ラウンドをもう一度くり返しても、元に戻るとは限りません（このデモのFでは、入力と鍵の4096通りのうち50通りだけ）。'
  };

  const MESSAGES = { ja };

  function t(key, vars = {}, lang) {
    const dict = MESSAGES[lang || (globalThis.InvolutionI18n && globalThis.InvolutionI18n.lang) || 'ja'] || ja;
    let text = Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
    for (const [k, v] of Object.entries(vars)) text = text.split(`{${k}}`).join(String(v));
    return text;
  }

  globalThis.InvolutionMessages = { MESSAGES, t };
})();
