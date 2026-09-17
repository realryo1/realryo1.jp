export function GET(request) {
  const urlStr = (request.url && typeof request.url === "string") ? request.url : `https://realryo1.jp/siguinkoicon/share`;
  const requestUrl = new URL(urlStr);
  const query = requestUrl.searchParams.toString();

  const appUrl = `https://realryo1.jp/siguinkoicon/?${query}`;
  const imageUrl = `https://realryo1.jp/siguinkoicon/api/og?${query}`;

  const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>シグリンコ アイコンジェネレータ</title>
  <meta name="description" content="作成されたアイコンを編集画面で開きます。">
  <meta property="og:type" content="website">
  <meta property="og:title" content="シグリンコ アイコンジェネレータ">
  <meta property="og:description" content="モグラではなくインコ">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="630">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="シグリンコ アイコンジェネレータ">
  <meta name="twitter:description" content="モグラではなくインコ">
  <meta name="twitter:image" content="${imageUrl}">
  <meta http-equiv="refresh" content="10; url=${appUrl}">
</head>
<body>
  <p>シグリンコ アイコンジェネレータへ飛んでいます……</p>
  <p><a href="${appUrl}">飛び立たない場合はこちらをクリック</a></p>
  <script>location.replace("${appUrl}");</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
