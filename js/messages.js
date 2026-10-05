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
    'reverse.note': 'コードポイント（Unicodeの1文字）で並べ替えると、家族の絵文字や国旗のように、複数のコードポイントで1つに見える文字は1回目で崩れて見えますが、2回目で元に戻ります。',
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
    'feistel.note': '同じ鍵のまま4ラウンド続けても、元の値に戻るとは限りません（このデモのFでは、入力と鍵の4096通りのうち戻るのは50通りだけ）。',

    'order.title': '何回で元に戻るか（位数）',
    'order.body': '同じ変換をくり返して、はじめて元に戻るまでの回数を、その変換の位数と呼びます。インボリューションは、位数が2の変換です（何も変えない変換は位数1）。\n'
      + 'シーザー暗号の3文字ずらしは26回、ROT13は2回で戻ります。トランプのパーフェクトシャッフルは、枚数によって回数が大きく変わります。',
    'order.kind': '変換',
    'order.kindCaesar': 'シーザー（ずらし幅を指定）',
    'order.kindRot13': 'ROT13',
    'order.kindAtbash': 'Atbash',
    'order.kindReverse': '文字反転',
    'order.kindPairs': 'ペア交換',
    'order.kindOut': 'パーフェクトシャッフル（アウト）',
    'order.kindIn': 'パーフェクトシャッフル（イン）',
    'order.k': 'ずらし幅（1〜25）',
    'order.run': '回数を数える',
    'order.err.empty': 'テキストを入力してください。',
    'order.err.odd': 'パーフェクトシャッフルは、文字数が偶数のときだけ使えます。',
    'order.err.k': 'ずらし幅は1〜25の整数で入力してください。',
    'order.resultInv': '{n}回で元に戻りました。2回で戻るので、インボリューションです。',
    'order.resultNot': '{n}回で元に戻りました。インボリューションではありません。',
    'order.resultSame': '1回目で変わりません（この入力では何も動きません）。',
    'order.resultNone': '{n}回くり返しても元に戻りませんでした。',
    'order.state': '{n}回目: {s}',
    'order.skip': '…（{from}〜{to}回目は省略）',

    'modern.title': '現代暗号とエニグマのインボリューション',
    'modern.feistel': 'Feistel構造の暗号（DESなど）は、鍵の順番を逆にするだけで、暗号化と同じ回路で復号できます（FIPS 46-3）。',
    'modern.khazad': 'Khazad（Barreto・Rijmen）はFeistel構造ではありませんが、ラウンドの部品をすべてインボリューションにして、'
      + '復号を「鍵スケジュールだけが違う同じ処理」にしています。Sボックスも2回で元に戻ります（S[S[x]] = x）。',
    'modern.prince': 'PRINCE（Borghoffほか, 2012）は、復号が、2つの白色化鍵を入れ替え、中心部の鍵を定数αとXORした鍵での暗号化と同じになるように作られています（α反射）。',
    'modern.enigma': 'エニグマは、反転円盤があるので、同じ設定なら暗号化と復号が同じ操作になります。'
      + 'その代わり、どの文字も自分自身には暗号化されず、これが解読の手がかりになる弱点にもなりました（換字式タブの「エニグマの反転円盤」で試せます）。',

    'reverse.unit': '反転の単位',
    'reverse.unitCodePoint': 'コードポイント（Unicodeの1文字）',
    'reverse.unitCodeUnit': 'UTF-16のコード単位',
    'reverse.unitGrapheme': '書記素（見た目の1文字）',
    'reverse.samples': '例を入れる',
    'reverse.sampleEmoji': '絵文字（A😀B）',
    'reverse.sampleFlags': '国旗（🇯🇵🇺🇸）',
    'reverse.sampleJamo': 'ハングルの字母（ᅡᄀ）',
    'reverse.units': 'UTF-16のコード単位で並べ替えると、絵文字のサロゲートペアが分かれて、途中の文字列が正しいUnicodeでなくなります（2回目で戻ります）。'
      + '書記素（見た目の1文字）で並べ替えると見た目は保てますが、いつも2回で戻るとは限りません。'
      + 'ハングルの字母は、子音のあとの母音だけが1文字にまとまるので（UAX #29の規則GB6）、「母音・子音」の順の2文字を反転すると1文字にまとまり、もう一度反転しても戻りません。',
    'reverse.warnBroken': '{n}回目の結果は、正しいUnicodeの文字列ではありません（孤立したサロゲートを含みます）。',
    'reverse.notBack': '{n}回適用しても元に戻りません。書記素の区切りが、並べ替えたあとで変わったためです。',
    'reverse.noSegmenter': 'このブラウザーは書記素の区切り（Intl.Segmenter）に対応していません。',

    'checker.title': 'インボリューション判定器',
    'checker.body': 'A〜Zの行き先を順に並べた26文字の換字表を入れると、2回適用して元に戻るか（インボリューションか）を判定し、'
      + '自分自身に移る文字（不動点）、入れ替わる組、3文字以上の巡回、元に戻るまでの回数を示します。',
    'checker.presets': '例を入れる',
    'checker.pAtbash': 'Atbash',
    'checker.pRot13': 'ROT13',
    'checker.pCaesar3': 'シーザー（3ずらし）',
    'checker.pBeaufortA': 'Beaufort（鍵A）',
    'checker.pBeaufortB': 'Beaufort（鍵B）',
    'checker.pUkwB': 'エニグマの反転円盤B',
    'checker.pRotorI': 'エニグマのローターI',
    'checker.pRandom': 'ランダムな対合',
    'checker.pRandomFree': '不動点のないランダムな対合',
    'checker.input': '換字表（A〜Zの行き先を順に26文字）',
    'checker.run': '判定する',
    'checker.fixed': '自分自身に移る文字（不動点）',
    'checker.pairs': '入れ替わる組',
    'checker.longer': '3文字以上の巡回',
    'checker.count': '26文字の並べ替え（26!通り）のうち、インボリューションは{all}通り、そのうち不動点のないものは{free}通りです。',
    'checker.resultFree': '2回適用すると元に戻ります。不動点のないインボリューションです（13組）。',
    'checker.resultInv': '2回適用すると元に戻ります。インボリューションです（{p}組、不動点{f}個）。',
    'checker.resultNot': 'インボリューションではありません。元に戻るまで{n}回かかります。',
    'checker.none': '（なし）',
    'checker.err.length': '26文字ちょうど入れてください（いまは{n}文字）。',
    'checker.err.letters': '英字（A〜Z）だけで入れてください。',
    'checker.err.duplicate': '同じ文字が重なっています。足りない文字: {list}',

    'enigma.title': 'エニグマの反転円盤',
    'enigma.body1': 'エニグマでは、キーを押すたびにローターが1つ進み、電流がローターを通って反転円盤で折り返し、別の道でローターを戻ってきます。'
      + '反転円盤は26文字を13組に結んでいるので、どの位置でも、暗号化は13組の入れ替えになります。',
    'enigma.body2': 'そのため、同じ設定で暗号文を打てば平文に戻り、暗号化と復号が同じ操作になります。'
      + 'その代わり、どの文字も自分自身には暗号化されません。これが解読の手がかりになる弱点にもなりました（Crypto Museum）。',
    'enigma.toy': 'このデモは、ローター1枚（Enigma IのローターI）と反転円盤（UKW-B）だけの簡易版です。'
      + '実機は3枚のローター、リング設定、プラグボードを持ちますが、反転円盤があるので、どの位置でも不動点のないインボリューションになる点は同じです。',
    'enigma.start': 'ローターの開始位置',
    'enigma.run': '暗号化',
    'enigma.again': '結果を同じ開始位置でもう一度',
    'enigma.mapLabel': '1文字目を打つとき（ローターが{pos}の位置）の対応。どの文字も自分自身には移りません',

    'reciprocal.title': 'ほかの相反暗号（try100）',
    'reciprocal.lead': '暗号化と復号が同じ操作になる暗号（相反暗号）は、ほかにもあります。try100の各ツールで試せます。',
    'reciprocal.beaufort': 'Beaufort暗号は、鍵の文字kから平文の文字pを引いたc = k − p（mod 26）で暗号化します。'
      + '復号もp = k − cと同じ式なので、鍵の文字ごとにインボリューションです。'
      + '鍵の文字がA・C・E・…・Yのときは、2文字が自分自身に移ります（判定器の「Beaufort（鍵A）」で確かめられます）。',
    'reciprocal.beaufortLink': '🔗 Beaufort CipherLab',
    'reciprocal.hill': 'Hill暗号は、文字の組を行列で変換します。A² ≡ I（mod 26）となる自己逆の行列、たとえばA = [[3, 2], [9, 23]]を鍵にすると、'
      + '暗号化と復号が同じ行列になります（行列式は25で、26と互いに素）。',
    'reciprocal.hillLink': '🔗 Hill CipherLab',
    'reciprocal.mirror': 'Mirror CipherLabでは、文字順の反転と字形の鏡像を同時に体験できます。どちらも、2回行うと元に戻ります。',
    'reciprocal.mirrorLink': '🔗 Mirror CipherLab',

    'xor.title': 'XOR（ストリーム暗号）',
    'xor.body': 'XORは、同じ値を2回XORすると元に戻ります（(P ⊕ K) ⊕ K = P）。ストリーム暗号は、平文に鍵の列をXORして暗号化し、'
      + '同じ鍵の列をもう一度XORして復号します。鍵を決めれば、暗号化そのものがインボリューションです。',
    'xor.reuse': 'そのため、同じ鍵の列を2つの平文に使うと、2つの暗号文のXORから鍵が消え、平文どうしのXORが残ります（C1 ⊕ C2 = P1 ⊕ P2）。'
      + 'ワンタイムパッドで鍵を使い回してはいけない理由です。',
    'xor.p1': '平文P1',
    'xor.run': '暗号化（P1 ⊕ K）',
    'xor.again': '暗号文にもう一度XOR',
    'xor.newKey': '鍵を作り直す',
    'xor.key': '鍵K（使う部分、16進数）',
    'xor.cipher': '暗号文C1（16進数）',
    'xor.plain': 'C1 ⊕ K（UTF-8として読む）',
    'xor.p2': '平文P2（同じ鍵を使い回す）',
    'xor.two': '同じ鍵でP2も暗号化して比べる',
    'xor.c2': '暗号文C2（16進数）',
    'xor.cx': 'C1 ⊕ C2',
    'xor.px': 'P1 ⊕ P2',
    'xor.note': 'UTF-8のバイト列にXORします。鍵はブラウザーの乱数（crypto.getRandomValues）で作り、外へ送りません。',
    'xor.link': '🔗 OTP Animation',
    'xor.statusBack': 'もう一度XORして、元の平文に戻りました。',
    'xor.statusEqual': 'C1 ⊕ C2とP1 ⊕ P2が一致しました（先頭{n}バイト）。鍵を知らなくても、平文どうしのXORが分かってしまいます。'
  };

  const en = {
    'ui.subtitle': 'A learning hub for involutions (transforms that return to the original when applied twice), '
      + 'with lightweight demos of substitution, transposition and bitwise operations',
    'ui.tabsLabel': 'Switch views',
    'ui.langButton': '日本語',
    'ui.langLabel': '日本語に切り替える',
    'ui.repo': 'GitHub repository (ipusiron/involution-studio)',
    'ui.noscript': 'This page needs JavaScript. Please enable JavaScript and reload the page.',
    'theme.toDark': 'Switch to dark mode',
    'theme.toLight': 'Switch to light mode',
    'tab.basics': 'Involution basics',
    'tab.subst': 'Substitution',
    'tab.trans': 'Transposition',
    'tab.bits': 'Bitwise',

    'basics.title': 'What is an involution?',
    'basics.p1': 'An involution is a transform that returns to the original when the same operation is applied twice. '
      + 'In mathematics it is written **f(f(x)) = x**.',
    'basics.p2': 'The most familiar example is reversing a string: "HELLO" → "OLLEH" → "HELLO" returns to the original after two applications. '
      + 'Matrix transposition, sign negation, bit inversion and classical ciphers such as Atbash and ROT13 share the same property.',
    'basics.math.title': 'Mathematical examples',
    'basics.math.body': 'An involution is a function that is its own inverse.\n'
      + 'Transposing a matrix gives (Aᵀ)ᵀ = A, negating gives −(−x) = x, and taking the reciprocal gives 1/(1/x) = x (x ≠ 0).\n'
      + 'In each case, applying the same operation once more to the first result gives back the starting value.',
    'basics.crypto.title': 'Use in cryptography',
    'basics.crypto.body': 'In an involutory cipher, encryption and decryption are the same procedure. Both can run on the same circuit or program, '
      + 'so a single implementation does both.\n'
      + 'Atbash maps the alphabet to itself in reverse order (A↔Z, B↔Y), ROT13 shifts by half of the 26 letters (13), '
      + 'and ROT47 shifts by half of 94 characters (47). Each returns to the original when applied twice.\n'
      + 'A Feistel structure is not an involution as a whole, but it decrypts on the same circuit as encryption just by reversing the order of the keys. '
      + 'DES uses this property (FIPS 46-3).',
    'basics.safety.title': 'Relation to security',
    'basics.safety.body': 'Atbash, ROT13 and ROT47 have no key. Anyone who knows the method can undo them with the same operation, '
      + 'so they make text unreadable at a glance (obfuscation) rather than keep secrets.\n'
      + 'Being an involution is not a weakness in itself. Feistel ciphers such as DES also encrypt and decrypt on the same circuit. '
      + 'What keeps such ciphers secure is the key.',

    'subst.title': 'Substitution involutions',
    'subst.lead': 'Transforms that replace characters with other characters and return to the original when applied twice. '
      + 'Lightweight demos are here, and the dedicated tools go further.',
    'atbash.title': 'Atbash',
    'atbash.body': 'Atbash is a substitution that maps the alphabet to itself in reverse order (A↔Z, B↔Y, …, M↔N). '
      + 'Applying the same substitution twice gives back the original letters.\n'
      + 'It began as a substitution of Hebrew letters, and its name comes from the pairs of the first and last letters (alef, taw) '
      + 'and the second and second-to-last letters (bet, shin). "Sheshach" in Jeremiah 25:26 is interpreted as "Babel" written in Atbash.',
    'atbash.note': 'Characters other than letters (digits, symbols, spaces, Japanese and so on) are left as they are. Upper and lower case are kept.',
    'atbash.table': 'Mapping table (letters used by the last application are highlighted)',
    'rot13.title': 'ROT13',
    'rot13.body': 'ROT13 is a substitution that shifts the 26 letters A–Z by half (13 letters). '
      + 'Because it shifts by half a turn, applying it twice gives back the original, so encryption and decryption are the same operation.',
    'rot13.link': '🔗 ROT13 Encoder',
    'rot47.title': 'ROT47',
    'rot47.body': 'ROT47 shifts ASCII 33–126 (94 characters: digits, symbols and letters) by half (47 characters). '
      + 'It makes more characters unreadable than ROT13 and also returns to the original when applied twice. Spaces and Japanese text are not changed.',
    'rot47.link': '🔗 QuickROT47',

    'demo.text': 'Text',
    'demo.run': 'Transform',
    'demo.again': 'Transform the result again',
    'demo.clear': 'Clear',
    'demo.result': 'Result',
    'demo.once': 'Applied once. Press "{again}" to apply it a second time.',
    'demo.back': 'Applied {n} times and back to the original "{text}".',
    'demo.count': 'Applied {n} times.',
    'demo.empty': '(empty string)',

    'trans.title': 'Transposition involutions',
    'trans.lead': 'Transforms that rearrange the order and return to the original when applied twice. You can check them with strings and matrices.',
    'reverse.title': 'String reversal',
    'reverse.body': 'The most basic transposition: arrange a string in reverse order. '
      + '"HELLO" → "OLLEH" → "HELLO" returns to the original after two applications.',
    'reverse.note': 'When rearranged by code point (one Unicode character), characters that look like one but consist of several code points, '
      + 'such as family emoji and flags, look broken after the first application but come back after the second.',
    'reverse.step': 'Application {n}: "{from}" → "{to}"',
    'reverse.run': 'Reverse',
    'reverse.again': 'Reverse the result again',
    'pairs.title': 'Pair swap',
    'pairs.body': 'Swaps each pair of adjacent characters. "ABCD" → "BADC" → "ABCD" returns to the original after two applications. '
      + 'If the length is odd, the last character stays where it is.',
    'pairs.shuffle': 'A perfect shuffle of playing cards (split the deck in half and interleave the cards one by one) is a different operation '
      + 'and does not return after two shuffles. With 52 cards, it takes 8 shuffles when the top card stays on top (out-shuffle) '
      + 'and 52 when it goes second (in-shuffle) to restore the original order (Diaconis, Graham and Kantor, 1983).',
    'pairs.run': 'Swap pairs',
    'pairs.again': 'Swap the result again',
    'pairs.list': 'Swapped pairs: {list}',
    'pairs.odd': 'the last "{c}" stays',
    'matrix.title': 'Matrix transposition',
    'matrix.body': 'Swaps the rows and columns of a matrix. Transposing twice gives back the original matrix, whether or not it is square.\n'
      + 'In a keyless columnar transposition cipher, writing the plaintext into a square and reading it out by columns '
      + 'is the same rearrangement as transposing the matrix.',
    'matrix.transpose': 'Transpose',
    'matrix.reset': 'Reset',
    'matrix.original': 'Original matrix (transposed {n} times)',
    'matrix.transposed': 'Transposed matrix (transposed {n} times)',
    'matrix.hint0': 'Press "Transpose".',
    'matrix.hint1': 'Transposing once more gives back the original matrix.',
    'matrix.hint2': 'Back to the original matrix.',
    'matrix.caption': 'A 3×3 matrix',
    'columnar.title': '💡 Try it in a real cipher tool',
    'columnar.body': 'To check the involution in a columnar transposition cipher, '
      + 'use no key and make the plaintext exactly fill a square (pad it if it is short).',
    'columnar.link': '🔗 Columnar CipherLab',

    'bits.title': 'Bitwise involutions',
    'bits.lead': 'Bit-level transforms that return to the original when applied twice. '
      + 'With the Feistel structure, you can see how decryption runs on the same circuit.',
    'not.title': 'Bitwise NOT',
    'not.body': 'Bit inversion (the NOT operation) turns 0 into 1 and 1 into 0. It is the most basic bit operation, '
      + 'and applying it twice in a row gives back the original bit pattern.',
    'not.input': 'Character or byte value',
    'not.mode': 'Input type',
    'not.modeChar': 'Character (U+0000–U+00FF)',
    'not.modeByte': 'Byte value (0–255)',
    'not.run': 'Invert bits',
    'not.again': 'Invert the result again',
    'not.before': 'Before',
    'not.after': 'After',
    'not.explain': 'Inversion {n}: {from} → {to}',
    'not.back': 'Inverted {n} times and back to the original value {v}.',
    'not.err.empty': 'Enter a value.',
    'not.err.many': 'Enter only one character.',
    'not.err.wide': 'Enter a character that fits in 8 bits (U+0000–U+00FF).',
    'not.err.range': 'Enter an integer from 0 to 255 (decimal).',

    'feistel.title': 'Feistel structure',
    'feistel.body1': 'A Feistel structure is the skeleton of a cipher that repeats one process (a round): split the data into left and right halves, '
      + 'XOR F(R, k), computed from the right half and a key, into the left half, and then swap the halves.',
    'feistel.body2': 'Even if the round function F has no inverse, you get back the original by swapping the halves of the ciphertext, '
      + 'running it through the same circuit with the keys in reverse order, and swapping once more.',
    'feistel.toy': 'This demo is a toy Feistel that splits 8 bits into two 4-bit halves (F(R, k) = ((R + k) mod 16) XOR (R >> 2)).',
    'feistel.value': 'Input value (0–255)',
    'feistel.keys': 'Round keys (0–15)',
    'feistel.key': 'k{n}',
    'feistel.next': 'Next step',
    'feistel.all': 'To the end',
    'feistel.reset': 'Start over',
    'feistel.progress': 'Step {i}/{n}',
    'feistel.colStep': 'Step',
    'feistel.colKey': 'Key',
    'feistel.colF': 'F(R, k)',
    'feistel.colAfter': '(L, R) after the step',
    'feistel.enc': 'Encryption round {n}',
    'feistel.swap': 'Swap halves',
    'feistel.dec': 'Decryption round {n}',
    'feistel.current': 'Current value',
    'feistel.left': 'Left (L)',
    'feistel.right': 'Right (R)',
    'feistel.start': 'Press "Next step" to run the encryption one round at a time.',
    'feistel.statusEnc': 'Encryption round {n}: XORed F(R, k{n}) = {f} into the left half and swapped the halves.',
    'feistel.statusCipher': 'Encryption is done. The ciphertext is {c} (binary {bin}). Next, decrypt it on the same circuit.',
    'feistel.statusSwap': 'Swapped the halves of the ciphertext. From here, it goes through the same circuit with the keys in reverse order ({keys}).',
    'feistel.statusDec': 'Decryption round {n}: the same processing as encryption, with key {k}.',
    'feistel.statusDone': 'Back to the original value {v}. The same circuit as encryption was used, with only the key order reversed.',
    'feistel.errValue': 'Enter the input value as an integer from 0 to 255.',
    'feistel.errKey': 'Enter each key as an integer from 0 to 15.',
    'feistel.halfTitle': 'One round without the swap returns after two applications',
    'feistel.halfBody': 'A round without the swap, (L, R) → (L ⊕ F(R, k), R), is an involution by itself, '
      + 'because XORing the same F(R, k) again cancels it out.',
    'feistel.halfRun': 'Apply twice with the input value and k1',
    'feistel.halfResult': '({l0}, {r0}) → ({l1}, {r1}) → ({l2}, {r2})',
    'feistel.halfBack': 'Back to the original (L, R) after the second application.',
    'feistel.note': 'Running 4 rounds with the same key does not necessarily return to the original value '
      + '(with the F of this demo, only 50 of the 4,096 combinations of input and key do).',

    'order.title': 'How many times until it returns (order)',
    'order.body': 'The number of repetitions a transform needs before it first returns to the original is called its order. '
      + 'An involution is a transform of order 2 (a transform that changes nothing has order 1).\n'
      + 'A Caesar shift of 3 returns after 26 times and ROT13 after 2. '
      + 'For a perfect shuffle of cards, the number changes a lot with the number of cards.',
    'order.kind': 'Transform',
    'order.kindCaesar': 'Caesar (choose the shift)',
    'order.kindRot13': 'ROT13',
    'order.kindAtbash': 'Atbash',
    'order.kindReverse': 'String reversal',
    'order.kindPairs': 'Pair swap',
    'order.kindOut': 'Perfect shuffle (out)',
    'order.kindIn': 'Perfect shuffle (in)',
    'order.k': 'Shift (1–25)',
    'order.run': 'Count the times',
    'order.err.empty': 'Enter some text.',
    'order.err.odd': 'A perfect shuffle works only when the number of characters is even.',
    'order.err.k': 'Enter the shift as an integer from 1 to 25.',
    'order.resultInv': 'Back to the original after {n} times. It returns after 2, so it is an involution.',
    'order.resultNot': 'Back to the original after {n} times. It is not an involution.',
    'order.resultSame': 'The first application changes nothing (nothing moves for this input).',
    'order.resultNone': 'Not back to the original after {n} repetitions.',
    'order.state': 'Time {n}: {s}',
    'order.skip': '… (times {from}–{to} omitted)',

    'modern.title': 'Involutions in modern ciphers and the Enigma',
    'modern.feistel': 'Feistel ciphers such as DES decrypt on the same circuit as encryption just by reversing the order of the keys (FIPS 46-3).',
    'modern.khazad': 'Khazad (Barreto and Rijmen) is not a Feistel cipher, but it makes every component of the round an involution, '
      + 'so decryption is the same process with only a different key schedule. Its S-box also returns after two applications (S[S[x]] = x).',
    'modern.prince': 'PRINCE (Borghoff et al., 2012) is built so that decryption equals encryption with a key in which the two whitening keys are swapped '
      + 'and the core key is XORed with a constant α (α-reflection).',
    'modern.enigma': 'Thanks to its reflector, the Enigma makes encryption and decryption the same operation with the same settings. '
      + 'In exchange, no letter is ever encrypted into itself, which also became a weakness that gave codebreakers a foothold '
      + '(try it in "The Enigma reflector" on the Substitution tab).',

    'reverse.unit': 'Unit of reversal',
    'reverse.unitCodePoint': 'Code point (one Unicode character)',
    'reverse.unitCodeUnit': 'UTF-16 code unit',
    'reverse.unitGrapheme': 'Grapheme (one visible character)',
    'reverse.samples': 'Insert an example',
    'reverse.sampleEmoji': 'Emoji (A😀B)',
    'reverse.sampleFlags': 'Flags (🇯🇵🇺🇸)',
    'reverse.sampleJamo': 'Hangul jamo (ᅡᄀ)',
    'reverse.units': 'Reversing by UTF-16 code unit splits the surrogate pairs of emoji, so the intermediate string is no longer valid Unicode '
      + '(it comes back on the second application). '
      + 'Reversing by grapheme (one visible character) keeps the look, but it does not always return after two applications. '
      + 'Hangul jamo join into one character only when a vowel follows a consonant (rule GB6 of UAX #29), '
      + 'so reversing the two characters "vowel, consonant" joins them into one, and reversing again does not bring them back.',
    'reverse.warnBroken': 'The result of application {n} is not a valid Unicode string (it contains a lone surrogate).',
    'reverse.notBack': 'Not back to the original after {n} applications, because the grapheme boundaries changed after rearranging.',
    'reverse.noSegmenter': 'This browser does not support grapheme segmentation (Intl.Segmenter).',

    'checker.title': 'Involution checker',
    'checker.body': 'Enter a 26-letter substitution table (where A to Z go, in order) to check whether applying it twice returns to the original '
      + '(whether it is an involution), and see the letters that map to themselves (fixed points), the swapped pairs, '
      + 'the cycles of 3 or more letters and the number of repetitions until it returns.',
    'checker.presets': 'Insert an example',
    'checker.pAtbash': 'Atbash',
    'checker.pRot13': 'ROT13',
    'checker.pCaesar3': 'Caesar (shift 3)',
    'checker.pBeaufortA': 'Beaufort (key A)',
    'checker.pBeaufortB': 'Beaufort (key B)',
    'checker.pUkwB': 'Enigma reflector B',
    'checker.pRotorI': 'Enigma rotor I',
    'checker.pRandom': 'Random involution',
    'checker.pRandomFree': 'Random involution without fixed points',
    'checker.input': 'Substitution table (where A to Z go, 26 letters in order)',
    'checker.run': 'Check',
    'checker.fixed': 'Letters that map to themselves (fixed points)',
    'checker.pairs': 'Swapped pairs',
    'checker.longer': 'Cycles of 3 or more letters',
    'checker.count': 'Of the rearrangements of 26 letters (26! of them), {all} are involutions, and {free} of those have no fixed points.',
    'checker.resultFree': 'Applying it twice returns to the original. It is an involution without fixed points (13 pairs).',
    'checker.resultInv': 'Applying it twice returns to the original. It is an involution ({p} pairs, {f} fixed points).',
    'checker.resultNot': 'It is not an involution. It takes {n} repetitions to return to the original.',
    'checker.none': '(none)',
    'checker.err.length': 'Enter exactly 26 letters (now {n}).',
    'checker.err.letters': 'Enter letters (A to Z) only.',
    'checker.err.duplicate': 'Some letters appear more than once. Missing letters: {list}',

    'enigma.title': 'The Enigma reflector',
    'enigma.body1': 'In the Enigma, each key press advances the rotor by one, and the current passes through the rotor, '
      + 'turns back at the reflector and returns through the rotor by a different path. '
      + 'The reflector connects the 26 letters in 13 pairs, so at every position the encryption is a swap of 13 pairs.',
    'enigma.body2': 'So typing the ciphertext with the same settings gives back the plaintext, and encryption and decryption are the same operation. '
      + 'In exchange, no letter is ever encrypted into itself. This also became a weakness that gave codebreakers a foothold (Crypto Museum).',
    'enigma.toy': 'This demo is a simplified version with only one rotor (rotor I of the Enigma I) and the reflector (UKW-B). '
      + 'The real machine has three rotors, ring settings and a plugboard, but because of the reflector it is likewise '
      + 'an involution without fixed points at every position.',
    'enigma.start': 'Starting rotor position',
    'enigma.run': 'Encrypt',
    'enigma.again': 'Run the result again from the same position',
    'enigma.mapLabel': 'The mapping for the first letter (rotor at position {pos}). No letter maps to itself',

    'reciprocal.title': 'Other reciprocal ciphers (try100)',
    'reciprocal.lead': 'There are other ciphers whose encryption and decryption are the same operation (reciprocal ciphers). '
      + 'You can try them in the try100 tools.',
    'reciprocal.beaufort': 'The Beaufort cipher encrypts with c = k − p (mod 26), subtracting the plaintext letter p from the key letter k. '
      + 'Decryption uses the same formula, p = k − c, so it is an involution for each key letter. '
      + 'When the key letter is A, C, E, …, Y, two letters map to themselves (check it with "Beaufort (key A)" in the checker).',
    'reciprocal.beaufortLink': '🔗 Beaufort CipherLab',
    'reciprocal.hill': 'The Hill cipher transforms groups of letters with a matrix. With a self-inverse matrix where A² ≡ I (mod 26), '
      + 'such as A = [[3, 2], [9, 23]], encryption and decryption use the same matrix (its determinant is 25, coprime to 26).',
    'reciprocal.hillLink': '🔗 Hill CipherLab',
    'reciprocal.mirror': 'Mirror CipherLab lets you try reversing the order of letters and mirroring their shapes at the same time. '
      + 'Both return to the original when done twice.',
    'reciprocal.mirrorLink': '🔗 Mirror CipherLab',

    'xor.title': 'XOR (stream cipher)',
    'xor.body': 'XORing the same value twice returns to the original ((P ⊕ K) ⊕ K = P). A stream cipher encrypts by XORing a key stream into the plaintext '
      + 'and decrypts by XORing the same key stream again. Once the key is fixed, the encryption itself is an involution.',
    'xor.reuse': 'So if the same key stream is used for two plaintexts, the key cancels out of the XOR of the two ciphertexts, '
      + 'leaving the XOR of the plaintexts (C1 ⊕ C2 = P1 ⊕ P2). This is why a one-time pad key must never be reused.',
    'xor.p1': 'Plaintext P1',
    'xor.run': 'Encrypt (P1 ⊕ K)',
    'xor.again': 'XOR the ciphertext again',
    'xor.newKey': 'Make a new key',
    'xor.key': 'Key K (the part used, hexadecimal)',
    'xor.cipher': 'Ciphertext C1 (hexadecimal)',
    'xor.plain': 'C1 ⊕ K (read as UTF-8)',
    'xor.p2': 'Plaintext P2 (reusing the same key)',
    'xor.two': 'Encrypt P2 with the same key and compare',
    'xor.c2': 'Ciphertext C2 (hexadecimal)',
    'xor.cx': 'C1 ⊕ C2',
    'xor.px': 'P1 ⊕ P2',
    'xor.note': 'XOR is applied to the UTF-8 bytes. The key is made with the browser random generator (crypto.getRandomValues) and is never sent anywhere.',
    'xor.link': '🔗 OTP Animation',
    'xor.statusBack': 'XORed again and back to the original plaintext.',
    'xor.statusEqual': 'C1 ⊕ C2 equals P1 ⊕ P2 (first {n} bytes). Without knowing the key, the XOR of the plaintexts is revealed.'
  };

  const MESSAGES = { ja, en };

  function t(key, vars = {}, lang) {
    const dict = MESSAGES[lang || (globalThis.InvolutionI18n && globalThis.InvolutionI18n.lang) || 'ja'] || ja;
    let text = Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
    for (const [k, v] of Object.entries(vars)) text = text.split(`{${k}}`).join(String(v));
    return text;
  }

  globalThis.InvolutionMessages = { MESSAGES, t };
})();
