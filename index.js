// jsでの配列操作のグッドプラクティス
// ①非破壊的操作
// ②冗長性を排除する

// 非破壊的とは？
// →元の配列を壊さず維持する
// 破壊的メソッドの例
// push
// pop
// unshift 配列の先頭に要素を追加する
// shift 配列の先頭の要素を削除する

// 非破壊的にpush, pop, unshift, shiftを代替する
// 要素を追加する(push, unshift) = スプレッド構文
// 要素を削除する(pop, shift) = filterで除外する
const list = [1, 2, 3]
// 末尾を削除する
console.log(list.filter((_, i) => i !== list.length - 1))
// より可読性に優れる
const indexDelete = list.length - 1
console.log(list.filter((_, i) => i !== indexDelete))

// ちなみに、ES2023では配列の要素を非破壊的に削除、置換、追加できる
// 一部のブラウザでは使える（Chromeは確認）
// 0番目から1番目の要素まで削除する
// const deleteFromIndex = 0
// const deleteToIndex = 1
// console.log(list.toSpliced(deleteFromIndex, deleteToIndex))

// 非破壊的に配列を加工する
// →mapを使う

// 新しい要素で埋める
new Array(10).fill('').map((_, i) => i)

// for文をforEachで置き換え
const length = 10;
[...Array(length).keys()].forEach(i => console.log(i))
console.log([...Array(length).keys()]) // [0 ~ 9]

// 配列を整列・逆順にするには？
// →スプレッド構文＋sort()
// →スプレッド構文＋reverse()
console.log([...list].sort())
// ES2023のtoSorted(), toReversed()メソッドでも非破壊的に整列・逆順にできる

// sortはコールバックでも配列の要素の整列条件を評価できる
// filterのように戻り値で配列のソート条件を指定する
// sortは比較関数を提供し、引数a,bを比較する
// 戻り値がプラスならaがbよりも前であることが保証され、
// 戻り値がマイナスならaがbよりも後であることが保証される
// 戻り値が0の場合は元の位置を維持する
const list1 = [
  {id: 2, label: "青森県"},
  {id: 3, label: "秋田県"},
  {id: 1, label: "北海道"},
];
console.log([...list1].sort((a, b) => a.id - b.id)) // 並び順の整理

// 非破壊的に配列を結合する
// →スプレッド構文、concat
console.log([...[1, 2, 3], ...[4, 5, 6]])
console.log([1, 2, 3].concat([4, 5, 6]))

// 冗長性とは？
// →可読性が悪かったり理解するのに一手間も二手間も思考の段階を踏む必要がある
// ex. Object.entries(object).map(entry => console.log(`${entry[0]} : ${entry[1]}`))
// good. Object.entries(object).forEach(([key, value]) => console.log(`${key} : ${value}`))
globalThis.object = { 'Japan': '寿司', 'America': 'hamburger' }
Object.entries(object).forEach(([key, value]) => console.log(`${key} + ${value}`))

// 配列に要素が含まれているか調べる
const isIncluded = ["a", "b", "c"].includes("c")
console.log(isIncluded)

// 条件に合致するか調べる
const isHit = [
  { country: "Japan", isCountry: true },
  { country: "Spain", isCountry: true },
  { country: "America", isCountry: true }
]
// 条件に一つでも合致した場合true
console.log(isHit.some(item => item.country === "America"))
// すべての要素が条件に合致したらtrue
console.log(isHit.every(item => item.isCountry === true))

// 条件に合致する要素を調べる
// someが条件を満たす要素が配列に含まれているか判定するのに対し、
// findはその要素を探して返す
// findは配列の先頭から調査するのに対し、findLastは後方から調べる
console.log(isHit.find(item => item.country === "Japan"))
console.log(isHit.findLast(item => item.isCountry === true))

// 重複を除いた配列を作る（ユニーク化する）
// Setコンストラクタで集合を作り、
// Array.fromで配列に変換する
const duplicated = [1, 2, 3, 3, 4, 4, 5, 6, 5]
const set = new Set(duplicated)
const unique = Array.from(new Set(duplicated))
console.log(set)
console.log(unique)

// 重複した要素が何か調べる
const list_2 = [3, 4, 6]
console.log(duplicated.filter(item => list_2.includes(item)))

// 重複を取り除いて、2つの配列で一致する要素を調べる
// Set型から配列を作るには、Array.fromの他、スプレッド構文もいける
const duplicated1 = [1, 2, 3, 3, 3, 5, 6]
const duplicated2 = [2, 3, 3, 4, 5, 5, 7]
console.log(Array.from(new Set(duplicated1)).filter(item => duplicated2.includes(item)))
console.log([...(new Set(duplicated1))].filter(item => duplicated2.includes(item)))

// 配列のシャローコピーとディープコピー
// スプレッド構文を使った展開は配列のシャローコピーと呼ばれる
// シャローコピーは、コピーとコピー元が同じオブジェクトとプロパティ参照を共有することを指す
const shallowArray = [...list]
console.log(shallowArray === list) // false 別の配列オブジェクトである

const originList = [
  {id: 1, label: "北海道", property: {hasSea: true}},
  {id: 2, label: "青森県", property: {hasSea: true}},
  {id: 3, label: "秋田県", property: {hasSea: true}},
];
const shallowList = [...originList];
// シャローコピーであるため、オブジェクトは複製されたわけではない
// 同じオブジェクトのプロパティ参照を共有している
console.log(shallowList[0].property === originList[0].property); // true

// ディープコピーにはstructuredCloneを使う
// ディープコピーは全く別のオブジェクトを作る
const deepList = structuredClone(originList)
console.log(deepList[0].property === originList[0].property) // false

// スプレッド構文もディープコピーも全く別の配列オブジェクトを作っている
// しかし、前述のように、シャローコピーは同じプロパティ参照を共有し、ディープコピーは全く別物という違いがある
console.log(list === list) // true
console.log([...shallowList] === shallowList) // false
console.log(shallowList[0].property === originList[0].property) // true
console.log(structuredClone(deepList) === deepList) // false
console.log(deepList[0].property === originList[0].property) // false

// 【配列操作を応用する】
const dataList = [
  { id: 1, name: "鈴木" },
  { id: 2, name: "田中" },
  { id: 3, name: "ゴンザレス" },
]
// id = 5がなければログを出力する
// ただし、冗長な記述である
let isFound = false
for (const data of dataList) {
  if (data.id === 5) {
    isFound = true;
    break;
  }
}
if (isFound === false) {
  console.log('id = 5はありません')
}

// someを使うと簡潔に記述できる
isFound = dataList.some(item => item.id === 5)
if (isFound === false) console.log('id = 5はありません')

// everyでもいい
const isNoValidId = dataList.every(item => item.id !== 5)
if (isNoValidId) console.log('id = 5はありません')

// nullかundefinedを拾いたい場合
if ("" != null) console.log("null or undefined")
if (null != null) console.log("aa")
if (undefined != undefined) console.log("aa")

// 【条件に合致する要素から配列を作成する】
const dataList2 = [
  { age: 40, name: "鈴木" },
  { age: 30, name: "田中" },
  { age: 21, name: "ゴンザレス" }
];
// 30歳以上の人物データの名前からなる配列を作る
// ただし、以下は冗長な記述である
const over30NameList = []
dataList2.forEach(data => {
  if (data.age >= 30) {
    over30NameList.push(data.name)
  }
})
console.log(over30NameList)

// filterとmapを使うと簡潔に記述できる
// filterで30歳以上のデータにフィルタリング
// mapでnameだけの配列に加工する
console.log(dataList2.filter(data => data.age >= 30).map(item => item.name))

// 多次元の配列（ジャグ配列）を1次元にする
const dataList3 = [
  {
    tweet: "今日は朝から仕事で大変だなあ",
    hash_tags: ["出勤", "早起き", "イマソラ"]
  },
  {
    tweet: "ランチで焼き肉を食べてしまった",
    hash_tags: ["ランチ", "焼き肉"]
  },
  {
    tweet: "家に帰って新作のゲームをしよう！",
    hash_tags: ["帰宅", "ゲーム", "日常"]
  }
]
const lineList = []

// 冗長な記述
const tagList = [];
dataList3.forEach(data => {
  data.hash_tags.forEach(tag => {
    tagList.push(tag);
  });
});

console.log(tagList);

// flatMap()を使うと簡潔に記述できる
// flatMap()はmap()のあとにflat()を実行する
console.log(dataList3.flatMap(item => item.hash_tags))

// flat()は多次元配列を1次元に置き換える
console.log('here is flat test')
console.log([1, [2, 3], [4], 5].flat(0)) // 何もしない
console.log([1, [2, 3], [4, 5], 6].flat(1)) // 2次元配列まで1次元配列に置き換える
console.log([1, [2, 3], [4, 5], 6].flat()) // デフォルト引数は1になっている
console.log([1, [1, 2, [3, 4, 5]], 6].flat(1)) // 深さ1までだと3次元部分[3, 4, 5]を平面化できない
console.log([1, [1, 2, [3, 4, 5]], 6].flat(2)) // 深さ2にすると3次元配列を1次元配列にできる
console.log('flat test end')

// 【document.querySelectorAllでmap, filter, everyなどを使う】
const nodeList = document.querySelectorAll('p')
// ノードリストはforEachやentriesなどは提供されているが、
// mapやfilterなどを使いたい場合はArray.from()を使う
nodeList.forEach()
nodeList.entries()
Array.from(nodeList).map()

// 【すべてのチェックボックスがチェックされているか検証する】
const isCheckedAll = Array.from(document.querySelectorAll('input[type="checkbox"]')).every(element => element.checked)
if (isCheckedAll) console.log('すべてのチェックボックスがチェック済み')
// ArrayFromのかわりにスプレッド構文もいける
console.log([...document.querySelectorAll('input[type="checkbox"]')])
