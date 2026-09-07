(() => {
  const SIZE = 512;
  const IMG_DIR = "./img/";
  const LIST_URL = `${IMG_DIR}imagelist.json`;
  const DEFAULT_BASE_FILE = "原始.png";

  /** @type {{ file: string, group: string, part: string|null, label: string }[]} */
  let assets = [];
  /** @type {Map<string, HTMLImageElement>} */
  const imageCache = new Map();
  /** @type {{ id: string, file: string, group: string, part: string|null, label: string }[]} */
  let layers = [];
  let idSeq = 0;

  function makeLayer(asset) {
    return {
      id: `layer-${++idSeq}`,
      file: asset.file,
      group: asset.group,
      part: asset.part,
      label: asset.label,
    };
  }

  const materialsEl = document.getElementById("materials");
  const materialsStatusEl = document.getElementById("materials-status");
  const materialsToggle = document.getElementById("materials-toggle");
  const materialsPanel =
    document.getElementById("materials-panel") ||
    materialsToggle?.closest(".panel");
  const layersEl = document.getElementById("layers");
  const layersEmptyEl = document.getElementById("layers-empty");
  const canvas = document.getElementById("preview");
  const ctx = canvas.getContext("2d");
  const btnFinish = document.getElementById("btn-finish");
  const modal = document.getElementById("modal");
  const resultImage = document.getElementById("result-image");

  function setMaterialsFolded(folded) {
    if (!materialsPanel || !materialsToggle) return;
    materialsToggle.setAttribute("aria-expanded", folded ? "false" : "true");
    materialsPanel.classList.toggle("is-folded", folded);
  }

  materialsToggle?.addEventListener("click", () => {
    const open = materialsToggle.getAttribute("aria-expanded") !== "false";
    setMaterialsFolded(open);
  });

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
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
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
    layers.unshift(makeLayer(asset));
    loadImage(asset.file);
    renderLayers();
    renderPreview();
  }

  function isGroupFullyAdded(groupName) {
    const items = assets.filter((a) => a.group === groupName);
    if (items.length === 0) return false;
    return items.every((item) => layers.some((l) => l.file === item.file));
  }

  function addGroup(groupName) {
    if (isGroupFullyAdded(groupName)) {
      const ok = window.confirm(
        "すでにこのグループは追加されています　追加しますか？"
      );
      if (!ok) return;
    }

    const items = assets.filter((a) => a.group === groupName);
    const incoming = items.map((item) => {
      loadImage(item.file);
      return makeLayer(item);
    });
    layers = incoming.concat(layers);
    renderLayers();
    renderPreview();
  }

  function removeLayer(id) {
    const target = layers.find((l) => l.id === id);
    if (!target || target.file === DEFAULT_BASE_FILE) return;
    layers = layers.filter((l) => l.id !== id);
    renderLayers();
    renderPreview();
  }

  function reorderLayers(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= layers.length || toIndex >= layers.length) return;
    const next = layers.slice();
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    layers = next;
  }

  /** @type {null | {
   *   id: string,
   *   el: HTMLElement,
   *   pointerId: number,
   *   startY: number,
   *   fromIndex: number,
   *   toIndex: number,
   *   slot: number,
   *   items: HTMLElement[],
   *   mids: number[],
   * }} */
  let dragState = null;

  function clearDragTransforms(items) {
    for (const el of items) {
      el.style.transform = "";
      el.classList.remove("is-dragging", "is-shifting");
    }
  }

  function applyDragShifts(state) {
    const { fromIndex, toIndex, slot, items, el } = state;
    items.forEach((item, i) => {
      if (item === el) return;
      item.classList.add("is-shifting");
      let shift = 0;
      if (fromIndex < toIndex && i > fromIndex && i <= toIndex) {
        shift = -slot;
      } else if (fromIndex > toIndex && i >= toIndex && i < fromIndex) {
        shift = slot;
      }
      item.style.transform = shift ? `translateY(${shift}px)` : "";
    });
  }

  function pointerYInList(clientY) {
    const listRect = layersEl.getBoundingClientRect();
    return clientY - listRect.top + layersEl.scrollTop;
  }

  function indexFromPointer(state, clientY) {
    const y = pointerYInList(clientY);
    const { mids, fromIndex } = state;
    let toIndex = fromIndex;

    for (let i = 0; i < mids.length; i++) {
      if (i === fromIndex) continue;
      if (i < fromIndex && y < mids[i]) {
        toIndex = i;
        break;
      }
      if (i > fromIndex && y > mids[i]) {
        toIndex = i;
      }
    }
    return toIndex;
  }

  function onDragMove(e) {
    if (!dragState || e.pointerId !== dragState.pointerId) return;
    const dy = e.clientY - dragState.startY;
    dragState.el.style.transform = `translateY(${dy}px)`;
    const toIndex = indexFromPointer(dragState, e.clientY);
    if (toIndex !== dragState.toIndex) {
      dragState.toIndex = toIndex;
      applyDragShifts(dragState);
    }
  }

  function onDragEnd(e) {
    if (!dragState || e.pointerId !== dragState.pointerId) return;
    const { fromIndex, toIndex, items, el, pointerId } = dragState;
    try {
      el.releasePointerCapture(pointerId);
    } catch {
      /* already released */
    }
    el.removeEventListener("pointermove", onDragMove);
    el.removeEventListener("pointerup", onDragEnd);
    el.removeEventListener("pointercancel", onDragEnd);

    clearDragTransforms(items);
    dragState = null;

    reorderLayers(fromIndex, toIndex);
    renderLayers();
    renderPreview();
  }

  function readGapPx(el) {
    const style = getComputedStyle(el);
    const raw =
      style.rowGap && style.rowGap !== "normal"
        ? style.rowGap
        : style.gap && style.gap !== "normal"
          ? style.gap
          : "0px";
    const first = String(raw).split(/\s+/)[0];
    const value = parseFloat(first);
    if (!Number.isFinite(value)) return 0;
    if (first.endsWith("rem")) {
      return value * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
    if (first.endsWith("em")) {
      return value * parseFloat(style.fontSize);
    }
    return value;
  }

  function startLayerDrag(e, layerId, li) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.target.closest(".layer-btn")) return;
    if (dragState) return;

    const items = [...layersEl.querySelectorAll(".layer-item")];
    const fromIndex = items.indexOf(li);
    if (fromIndex < 0) return;

    const rect = li.getBoundingClientRect();
    const slot = rect.height + readGapPx(layersEl);
    const listRect = layersEl.getBoundingClientRect();
    const scrollTop = layersEl.scrollTop;
    const mids = items.map((item) => {
      const r = item.getBoundingClientRect();
      return r.top - listRect.top + scrollTop + r.height / 2;
    });

    dragState = {
      id: layerId,
      el: li,
      pointerId: e.pointerId,
      startY: e.clientY,
      fromIndex,
      toIndex: fromIndex,
      slot,
      items,
      mids,
    };

    li.classList.add("is-dragging");
    li.setPointerCapture(e.pointerId);
    li.addEventListener("pointermove", onDragMove);
    li.addEventListener("pointerup", onDragEnd);
    li.addEventListener("pointercancel", onDragEnd);
    e.preventDefault();
  }

  function renderMaterials() {
    materialsEl.replaceChildren();
    const grouped = groupAssets(assets.map((a) => a.file));

    for (const [groupName, items] of grouped) {
      const groupLi = document.createElement("li");
      groupLi.className = "mat-group";

      const groupRow = document.createElement("button");
      groupRow.type = "button";
      groupRow.className = "mat-row mat-row-group";
      groupRow.setAttribute(
        "aria-label",
        `${groupName}グループをすべて追加`
      );

      const groupThumb = document.createElement("img");
      groupThumb.className = "mat-thumb";
      groupThumb.alt = "";
      groupThumb.loading = "lazy";
      groupThumb.src =
        IMG_DIR + encodeURIComponent(items[0].file).replace(/%2F/gi, "/");

      const groupLabel = document.createElement("span");
      groupLabel.className = "mat-label";
      groupLabel.textContent = groupName;

      const groupMeta = document.createElement("span");
      groupMeta.className = "mat-meta";
      groupMeta.textContent = `${items.length}点`;

      groupRow.append(groupThumb, groupLabel, groupMeta);
      groupRow.addEventListener("click", () => addGroup(groupName));

      const partList = document.createElement("ul");
      partList.className = "mat-parts";

      for (const item of items) {
        const partLi = document.createElement("li");
        const partRow = document.createElement("button");
        partRow.type = "button";
        partRow.className = "mat-row mat-row-part";
        partRow.setAttribute("aria-label", `${item.label}を追加`);

        const thumb = document.createElement("img");
        thumb.className = "mat-thumb";
        thumb.alt = "";
        thumb.loading = "lazy";
        thumb.src =
          IMG_DIR + encodeURIComponent(item.file).replace(/%2F/gi, "/");

        const label = document.createElement("span");
        label.className = "mat-label";
        label.textContent = item.part ?? item.group;

        partRow.append(thumb, label);
        partRow.addEventListener("click", () => addAsset(item));
        partLi.append(partRow);
        partList.append(partLi);
      }

      groupLi.append(groupRow, partList);
      materialsEl.append(groupLi);
    }
  }

  function renderLayers() {
    layersEl.replaceChildren();
    layersEmptyEl.hidden = layers.length > 0;

    layers.forEach((layer) => {
      const li = document.createElement("li");
      li.className = "layer-item";
      li.dataset.id = layer.id;

      const thumb = document.createElement("img");
      thumb.className = "layer-thumb";
      thumb.alt = "";
      thumb.draggable = false;
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

      if (layer.file !== DEFAULT_BASE_FILE) {
        const del = document.createElement("button");
        del.type = "button";
        del.className = "layer-btn is-danger";
        del.textContent = "削除";
        del.addEventListener("click", (ev) => {
          ev.stopPropagation();
          removeLayer(layer.id);
        });
        del.addEventListener("pointerdown", (ev) => ev.stopPropagation());
        controls.append(del);
      }

      li.append(thumb, meta, controls);
      li.addEventListener("pointerdown", (ev) => startLayerDrag(ev, layer.id, li));
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
      .filter(
        (f) =>
          typeof f === "string" &&
          /\.png$/i.test(f) &&
          f !== DEFAULT_BASE_FILE
      )
      .map(parseFileName);

    const base = parseFileName(DEFAULT_BASE_FILE);
    layers = [makeLayer(base)];
    loadImage(base.file);

    setStatus("");
    renderMaterials();
    renderLayers();
    renderPreview();
  }

  init();
})();
