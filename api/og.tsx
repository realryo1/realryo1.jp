import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

const ASSET_ORIGIN = "https://realryo1.jp/siguinkoicon/img";
const MANIFEST_URL = "https://realryo1.jp/siguinkoicon/img/imagelist.json";
const MAX_LAYERS = 12;
const MAX_QUERY_LENGTH = 512;

export async function GET(request) {
  const url = new URL(request.url);

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

  let manifest = {};
  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-cache" });
    if (res.ok) manifest = await res.json();
  } catch {
    // 失敗時は空
  }

  const fixedFiles = Object.keys(manifest || {}).filter((f) => f.startsWith("固定"));
  const fixedLayers = fixedFiles.map((file) => `${ASSET_ORIGIN}/${file}`);

  const userLayers = [];
  for (const idStr of ids) {
    if (!/^\d{1,6}$/.test(idStr)) {
      return new Response("Invalid id format", { status: 400 });
    }
    const id = Number(idStr);
    const file = Object.entries(manifest).find(([_, v]) => v === id);
    if (!file) {
      return new Response("Invalid id", { status: 400 });
    }
    userLayers.push(`${ASSET_ORIGIN}/${file[0]}`);
  }

  const layers = fixedLayers.concat(userLayers);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <div style={{ width: "630px", height: "630px", position: "relative" }}>
          {layers.map((src, index) => (
            <img
              key={`${index}:${src}`}
              src={src}
              width="630"
              height="630"
              style={{ position: "absolute", left: "0", top: "0" }}
            />
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=31536000, immutable",
      },
    }
  );
}
