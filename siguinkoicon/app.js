(() => {
  const SIZE = 512;
  const IMG_DIR = "./img/";
  const LIST_URL = `${IMG_DIR}imagelist.json`;

  /** @type {{ file: string, group: string, part: string|null, label: string }[]} */
  let assets = [];
  /** @type {Map<string, HTMLImageElement>} */
  const imageCache = new Map();
  /** @type {{ id: string, file: string, group: string, part: string|null, label: string }[]} */
  let layers = [];
  let idSeq = 0;

  const materialsEl = document.getElementById("materials");
  const materialsStatusEl = document.getElementById("materials-status");
  const layersEl = document.getElementById("layers");
  const layersEmptyEl = document.getElementById("layers-empty");
  const canvas = document.getElementById("preview");
  const ctx = canvas.getContext("2d");
  const btnFinish = document.getElementById("btn-finish");
  const modal = document.getElementById("modal");
  const resultImage = document.getElementById("result-image");

  function parseFileName(file) {
    const base = file.replace(/\.png$/i, "");
    const idx = base.indexOf("_");
    if (idx === -1) {
      return { file, group: base, part: null, label: base };
    }
    const group = base.slice(0, idx);
    const part = base.slice(idx + 1);
    return { file, group, part, label: part || group };
  }

  function groupAssets(list) {
    /** @type {Map<string, ReturnType<typeof parseFileName>[]>} */
    const map = new Map();
    for (const file of list) {
      if (typeof file !== "string" || !/\.png$/i.test(file)) continue;
      const item = parseFileName(file);
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group).push(item);
    }
    return map;
  }

  function setStatus(message, tone) {
    if (!message) {
      materialsStatusEl.hidden = true;
      materialsStatusEl.textContent = "";
      return;
    }
    materialsStatusEl.hidden = false;
    materialsStatusEl.textContent = message;
    materialsStatusEl.dataset.tone = tone || "";
  }

  function loadImage(file) {
    if (imageCache.has(file)) return imageCache.get(file);
    const img = new Image();
    img.decoding = "async";
    img.src = IMG_DIR + encodeURIComponent(file).replace(/%2F/gi, "/");
    imageCache.set(file, img);
    const ready = img.decode
      ? img.decode().catch(() => {
          if (img.complete && img.naturalWidth > 0) return;
          return new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`failed: ${file}`));
          });
        })
      : new Promise((resolve, reject) => {
          if (img.complete && img.naturalWidth > 0) resolve();
          else {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`failed: ${file}`));
          }
        });
    img._ready = ready;
    return img;
  }

  function drawContain(image, targetCtx, size) {
    const iw = image.naturalWidth || image.width;
    const ih = image.naturalHeight || image.height;
    if (!iw || !ih) return;
    const scale = Math.min(size / iw, size / ih);
    const w = iw * scale;
    const h = ih * scale;
    const x = (size - w) / 2;
    const y = (size - h) / 2;
    targetCtx.drawImage(image, x, y, w, h);
  }

  async function renderPreview() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    for (const layer of layers) {
      const img = loadImage(layer.file);
      try {
        await img._ready;
        drawContain(img, ctx, SIZE);
      } catch {
        /* skip broken asset */
      }
    }
    btnFinish.disabled = layers.length === 0;
  }

  function addAsset(asset) {
    layers.push({
      id: `layer-${++idSeq}`,
      file: asset.file,
      group: asset.group,
      part: asset.part,
      label: asset.label,
    });
    loadImage(asset.file);
    renderLayers();
    renderPreview();
  }

  function addGroup(groupName) {
    const items = assets.filter((a) => a.group === groupName);
    for (const item of items) addAsset(item);
  }

  function moveLayer(id, dir) {
    const i = layers.findIndex((l) => l.id === id);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= layers.length) return;
    const tmp = layers[i];
    layers[i] = layers[j];
    layers[j] = tmp;
    renderLayers();
    renderPreview();
  }

  function removeLayer(id) {
    layers = layers.filter((l) => l.id !== id);
    renderLayers();
    renderPreview();
  }

  function renderMaterials() {
    materialsEl.replaceChildren();
    const grouped = groupAssets(assets.map((a) => a.file));

    for (const [groupName, items] of grouped) {
      const groupEl = document.createElement("div");
      groupEl.className = "group";
      groupEl.setAttribute("role", "listitem");

      const head = document.createElement("div");
      head.className = "group-head";

      const name = document.createElement("div");
      name.className = "group-name";
      name.textContent = groupName;

      const addAll = document.createElement("button");
      addAll.type = "button";
      addAll.className = "btn-group-add";
      addAll.textContent = "グループ追加";
      addAll.addEventListener("click", () => addGroup(groupName));

      head.append(name, addAll);

      const partList = document.createElement("ul");
      partList.className = "part-list";

      for (const item of items) {
        const li = document.createElement("li");
        li.className = "part-card";

        const thumb = document.createElement("img");
        thumb.className = "part-thumb";
        thumb.alt = item.label;
        thumb.loading = "lazy";
        thumb.src = IMG_DIR + encodeURIComponent(item.file).replace(/%2F/gi, "/");

        const label = document.createElement("div");
        label.className = "part-label";
        label.textContent = item.part ?? item.group;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-part";
        btn.textContent = "追加";
        btn.addEventListener("click", () => addAsset(item));

        li.append(thumb, label, btn);
        partList.append(li);
      }

      groupEl.append(head, partList);
      materialsEl.append(groupEl);
    }
  }

  function renderLayers() {
    layersEl.replaceChildren();
    layersEmptyEl.hidden = layers.length > 0;

    layers.forEach((layer, index) => {
      const li = document.createElement("li");
      li.className = "layer-item";

      const thumb = document.createElement("img");
      thumb.className = "layer-thumb";
      thumb.alt = "";
      thumb.src = IMG_DIR + encodeURIComponent(layer.file).replace(/%2F/gi, "/");

      const meta = document.createElement("div");
      meta.className = "layer-meta";
      const title = document.createElement("div");
      title.className = "layer-title";
      title.textContent = layer.label;
      const sub = document.createElement("div");
      sub.className = "layer-sub";
      sub.textContent = layer.part ? `${layer.group} / ${layer.part}` : layer.group;
      meta.append(title, sub);

      const controls = document.createElement("div");
      controls.className = "layer-controls";

      const up = document.createElement("button");
      up.type = "button";
      up.className = "layer-btn";
      up.textContent = "▲";
      up.title = "上へ（背面側）";
      up.disabled = index === 0;
      up.addEventListener("click", () => moveLayer(layer.id, -1));

      const down = document.createElement("button");
      down.type = "button";
      down.className = "layer-btn";
      down.textContent = "▼";
      down.title = "下へ（前面側）";
      down.disabled = index === layers.length - 1;
      down.addEventListener("click", () => moveLayer(layer.id, 1));

      const del = document.createElement("button");
      del.type = "button";
      del.className = "layer-btn is-danger";
      del.textContent = "削除";
      del.addEventListener("click", () => removeLayer(layer.id));

      controls.append(up, down, del);
      li.append(thumb, meta, controls);
      layersEl.append(li);
    });
  }

  function openModal() {
    resultImage.src = canvas.toDataURL("image/png");
    modal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    resultImage.removeAttribute("src");
  }

  btnFinish.addEventListener("click", () => {
    if (layers.length === 0) return;
    openModal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  async function init() {
    btnFinish.disabled = true;
    setStatus("素材リストを読み込み中…");

    let raw;
    try {
      const res = await fetch(LIST_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      raw = await res.json();
    } catch {
      setStatus(
        "imagelist.json がありません。GitHub Actions の手動デプロイで生成されます。",
        "error"
      );
      return;
    }

    if (!Array.isArray(raw)) {
      setStatus("imagelist.json の形式が不正です（配列である必要があります）。", "error");
      return;
    }

    assets = raw
      .filter((f) => typeof f === "string" && /\.png$/i.test(f))
      .map(parseFileName);

    if (assets.length === 0) {
      setStatus("素材がありません。img に PNG を追加してデプロイしてください。", "error");
      return;
    }

    setStatus("");
    renderMaterials();
    renderLayers();
    renderPreview();
  }

  init();
})();
