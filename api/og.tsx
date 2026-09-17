import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

const ASSET_ORIGIN = "https://realryo1.jp/siguinkoicon/img";
const MAX_LAYERS = 12;
const MAX_QUERY_LENGTH = 512;

export default function handler(req: Request) {
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

  const manifest: Record<string, number> = {
    "3か4.png": 1, "B.png": 2, "jre_a右羽.png": 3, "jre_a左羽.png": 4,
    "jre_a耳.png": 5, "jre_b.png": 6, "jre_cのペット.png": 7, "jre_c右耳.png": 8,
    "jre_c左耳.png": 9, "いのち_タグ.png": 10, "いのち_ボールチェーン.png": 11,
    "いのち_右目.png": 12, "いのち_左目.png": 13, "うらら_リボン.png": 14,
    "うらら_頭のやつ.png": 15, "おうち_眼鏡.png": 16, "おうち_髪飾り.png": 17,
    "かけ_アホ毛.png": 18, "かけ_右おにぎりぼん.png": 19, "かけ_左おにぎりぼん.png": 20,
    "すぷか_リボン.png": 21, "すぷか_髪留め.png": 22,
    "その他_3回見たら鳥になる絵.png": 23, "その他_うちのとり.png": 24,
    "その他_オカ.png": 25, "その他_ゲーミング.png": 26, "その他_ゲーミング手.png": 27,
    "その他_ピース.png": 28, "その他_ル.png": 29, "その他_円ガイド.png": 30,
    "その他_国鳥.png": 31, "てんす_ヘッドホン.png": 32, "てんす_髪飾り.png": 33,
    "なつまつり_ヘアピン.png": 34, "なつまつり_右髪留め.png": 35,
    "なつまつり_左髪留め.png": 36, "なつまつり_髪飾り.png": 37,
    "はな_右髪飾り.png": 38, "はな_左髪飾り.png": 39, "ぱてぃ_クッキー.png": 40,
    "ぱてぃ_ネクタイ.png": 41, "ぱてぃ_帽子.png": 42, "ぱれ_はんぺん.png": 43,
    "ぱれ_リボン.png": 44, "ひーろー.png": 45, "ふゆまつり_ヘアピン.png": 46,
    "ふゆまつり_ヘッドフォン.png": 47, "ぶるみん_アホ毛.png": 48,
    "ぶるみん_髪留め.png": 49, "ほるん_アホ毛.png": 50, "ほるん_ヘアピン.png": 51,
    "ほるん_帽子.png": 52, "エトワ_右髪.png": 53, "エトワ_左髪.png": 54,
    "エトワ_髪飾り.png": 55, "カス_右.png": 56, "カス_左.png": 57,
    "キラキラスノーマテリアル_丸.png": 58, "キラキラスノーマテリアル_結晶.png": 59,
    "デートコーデ_ヘアピン.png": 60, "デートコーデ_帽子.png": 61,
    "パンチングペン_右耳.png": 62, "パンチングペン_右腕.png": 63,
    "パンチングペン_左耳.png": 64, "パンチングペン_左腕.png": 65,
    "パンチングペン_頬.png": 66, "マック・ハリー.png": 67, "ミャクミャク.png": 68,
    "初号機_つの.png": 69, "初号機_右腕.png": 70, "初号機_左腕.png": 71,
    "初号機_顎.png": 72, "固定_原始.png": 73, "小袖_右.png": 74, "小袖_左.png": 75,
    "深海_アホ毛.png": 76, "深海_服.png": 77, "深海_髪飾り.png": 78,
    "片目フラワー.png": 79, "牛角の人_右.png": 80, "牛角の人_左.png": 81,
    "生徒.png": 82, "織姫_プレッツェル.png": 83, "織姫_星太郎.png": 84,
    "麺汁.png": 85, "鼓童_はちまき.png": 86, "鼓童_右バチ.png": 87, "鼓童_左バチ.png": 88
  };

  const layers: string[] = [];
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          position: "relative",
          display: "flex",
          overflow: "hidden",
          background: "#17171f",
        }}
      >
        <div
          style={{
            width: "630px",
            height: "630px",
            position: "absolute",
            right: "0",
            top: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {layers.map((src, index) => (
            <img
              key={`${index}:${src}`}
              src={src}
              width="630"
              height="630"
              style={{
                position: "absolute",
                left: "0",
                top: "0",
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: "56px",
            bottom: "65px",
            display: "flex",
            color: "white",
            fontSize: "44px",
            fontWeight: "bold",
          }}
        >
          しぐいんこアイコン
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
