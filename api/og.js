export const config = { runtime: "edge" };

const ASSET_ORIGIN = "https://realryo1.jp/siguinkoicon/img";
const MANIFEST_URL = "https://realryo1.jp/siguinkoicon/img/imagelist.json";
const MAX_LAYERS = 12;
const MAX_QUERY_LENGTH = 512;

export default async function handler(req) {
  const url = new URL(req.url);

  if (url.search.length > MAX_QUERY_LENGTH) {
    return new Response("Query too long", { status: 400 });
  }
  if (url.searchParams.get("v") !== "1") {
    return new Response("Invalid version", { status: 400 });
  }

  const ids = url.searchParams.getAll("i");
  if (ids.length === 0 || ids.length > MAX_LAYERS) {
    return new Response("Invalid layer count", { status: 400 });
  }

  // マニフェストを公開URLから取得（直書きを避ける）
  let manifest = {};
  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-cache" });
    if (res.ok) manifest = await res.json();
  } catch {
    // 取得失敗時は空のまま進め、下で検証して400を返す
  }

  const layers = [];
  for (const idStr of ids) {
    if (!/^\d{1,6}$/.test(idStr)) {
      return new Response("Invalid id format", { status: 400 });
    }
    const id = Number(idStr);
    const file = Object.entries(manifest).find(([_, v]) => v === id);
    if (!file) {
      return new Response("Invalid id", { status: 400 });
    }
    layers.push(`${ASSET_ORIGIN}/${file[0]}`);
  }

  const layerTags = layers.map((src) => `<img src="${src}" width="630" height="630" style="position:absolute;left:0;top:0;"/>`).join("");

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>OG</title></head>
<body style="margin:0;background:#17171f;">
<div style="width:1200px;height:630px;position:relative;background:#17171f;">
  <div style="width:630px;height:630px;position:absolute;right:0;top:0;">${layerTags}</div>
  <div style="position:absolute;left:56px;bottom:65px;color:white;font-size:44px;font-weight:bold;">しぐいんこアイコン</div>
</div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=31536000, immutable",
    },
  });
}
