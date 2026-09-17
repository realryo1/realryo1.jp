import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

const ASSET_ORIGIN = "https://realryo1.jp/siguinkoicon/img";
const MANIFEST_URL = "https://realryo1.jp/siguinkoicon/img/imagelist.json";
const MAX_LAYERS = 12;
const MAX_QUERY_LENGTH = 512;
const OG_SIZE = 630;

function parseHex(raw: string | null): { rgb: string; alpha: number } {
  const hex = String(raw || "FFFFFFFF").replace(/^#/, "").toUpperCase();
  const rgb = /^[0-9A-F]{6}/.test(hex) ? hex.slice(0, 6) : "FFFFFF";
  const a = hex.slice(6, 8);
  const alphaByte = /^[0-9A-F]{2}$/.test(a) ? parseInt(a, 16) : 255;
  return { rgb, alpha: Math.max(0, Math.min(1, alphaByte / 255)) };
}

export async function GET(request: Request) {
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
  const { rgb, alpha } = parseHex(url.searchParams.get("hex"));

  return new ImageResponse(
    (
      <div
        style={{
          width: `${OG_SIZE}px`,
          height: `${OG_SIZE}px`,
          position: "relative",
          display: "flex",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            width: `${OG_SIZE}px`,
            height: `${OG_SIZE}px`,
            display: "flex",
            backgroundColor: `#${rgb}`,
            opacity: alpha,
          }}
        />
        {layers.map((src, index) => (
          <img
            key={`${index}:${src}`}
            src={src}
            width={OG_SIZE}
            height={OG_SIZE}
            style={{ position: "absolute", left: "0", top: "0" }}
          />
        ))}
      </div>
    ),
    {
      width: OG_SIZE,
      height: OG_SIZE,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=31536000, immutable",
      },
    }
  );
}
