# siguinkoicon

静的なアイコン合成ツール。素材 PNG をレイヤーとして重ね、512×512 の PNG を出す。

リポジトリ: https://github.com/realryo1/realryo1.jp

**PNG 本体は読まない。** `.cursorignore` で `siguinkoicon/img/*.png` を除外している。ファイル名と `imagelist.json` だけで判断する。ピクセル内容・見た目・権利判断は対象外。

## 構成

- `index.html` / `style.css` / `app.js` … UI と合成ロジック
- `img/*.png` … 素材（AI は開かない）
- `img/imagelist.json` … PNG ファイル名の配列。アプリの唯一の素材カタログ

素材の追加・削除は PNG を `img/` に置く／消すだけ。カタログ手編集はしない。

## imagelist.json

形式: `string[]`。各要素は `img/` 直下の `.png` ファイル名。

生成は `.github/workflows/deploy-pages.yml` の `Generate siguinkoicon imagelist.json`。手動 `workflow_dispatch` 時に:

1. `siguinkoicon/img/` の `.png` を名前順で列挙
2. `imagelist.json` を書き出し（UTF-8、`ensure_ascii=False`、末尾改行）
3. 差分があれば commit / push（メッセージ `chore: update siguinkoicon imagelist`）
4. その後サイト全体を GitHub Pages へデプロイ

ローカルに JSON がなくてもデプロイで揃う。アプリは `fetch("./img/imagelist.json")` に失敗したら素材を出さない。

## ファイル名規則（`app.js` `parseFileName`）

拡張子を除いたベース名:

- `{group}_{part}.png` → group / part。UI ラベルは part
- `{group}.png`（`_` なし）→ group のみ。part は null
- `固定` で始まる → 固定レイヤー。`固定` と直後の `_` を除いてから上記を適用

例: `固定_原始.png` → locked、group=`原始`。`ほるん_帽子.png` → group=`ほるん`, part=`帽子`。

同一 group は素材パネルでまとまる。1枚ならグループ行のみ、複数ならグループ一括追加 + 各 part。

## レイヤーモデル

配列先頭が前面。描画は末尾から。

- 通常: 素材パネルから追加。削除可。ドラッグで並べ替え
- 固定 (`固定*`): init で自動投入。素材パネルには出さない。削除不可。並べ替えは可
- 背景色: 常に最背面。移動・削除不可。色と不透明度 0–255

固定は `layers` の先頭側に置き、その直後に背景を pin する。ユーザー追加は `unshift` なので固定より前（より前面）に乗る。

重複追加は confirm。グループ一括は未追加分だけ足す。全部済みなら confirm 後に全枚を再度足す。

プレビュー / 完成は canvas に contain 描画。完成は `toDataURL("image/png")`。
