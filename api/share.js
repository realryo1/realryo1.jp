export default function handler(req) {
  const rawUrl = (req.url && typeof req.url === "string") ? req.url : "/";
  const urlStr = rawUrl.startsWith("http") ? rawUrl : `https://realryo1.jp${rawUrl}`;
  const requestUrl = new URL(urlStr);
  const query = requestUrl.searchParams.toString();

  const appUrl = `https://realryo1.jp/siguinkoicon/?${query}`;
  const imageUrl = `https://realryo1.jp/siguinkoicon/api/og?${query}`;

  const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>しぐいんこアイコンジェネレーター</title>
  <meta name="description" content="作成されたアイコンを編集画面で開きます。">

  <meta property="og:type" content="website">
  <meta property="og:title" content="しぐいんこアイコン">
  <meta property="og:description" content="アイコンジェネレーターで作成">
  <meta property="og:image" content="${imageUrl}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="しぐいんこアイコン">
  <meta name="twitter:description" content="アイコンジェネレーターで作成">
  <meta name="twitter:image" content="${imageUrl}">

  <meta http-equiv="refresh" content="0; url=${appUrl}">
</head>
<body>
  <p>アイコンジェネレーターを開いています…</p>
  <p><a href="${appUrl}">自動で移動しない場合はこちら</a></p>
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
