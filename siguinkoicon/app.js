(() => {
  const SIZE = 512;
  const IMG_DIR = "./img/";
  const LIST_URL = `${IMG_DIR}imagelist.json`;
  const BG_LAYER_ID = "layer-background";
  const FIXED_PREFIX = "固定";

  /** @type {{ file: string, group: string, part: string|null, label: string }[]} */
  let assets = [];
  /** @type {Map<string, HTMLImageElement>} */
  const imageCache = new Map();
  /**
   * @typedef {{
   *   id: string,
   *   kind?: 'image' | 'background',
   *   file?: string,
   *   group?: string,
   *   part?: string|null,
   *   label: string,
   *   color?: string,
   *   opacity?: number,
   * }} Layer
   */
  /** @type {Layer[]} */
  let layers = [];
  let idSeq = 0;
  let renderVersion = 0;

  function makeLayer(asset) {
    return {
      id: `layer-${++idSeq}`,
      kind: "image",
      file: asset.file,
      group: asset.group,
      part: asset.part,
      label: asset.label,
      locked: Boolean(asset.locked),
    };
  }

  function fileBaseName(file) {
    return String(file).replace(/^.*[\\/]/, "");
  }

  function isFixedFile(file) {
    return fileBaseName(file).startsWith(FIXED_PREFIX);
  }

  function isFixedLayer(layer) {
    return Boolean(layer?.locked) || isFixedFile(layer?.file);
  }

  function makeBackgroundLayer() {
    return {
      id: BG_LAYER_ID,
      kind: "background",
      label: "背景色",
      color: "#ffffff",
      opacity: 255,
    };
  }

  function isBackgroundLayer(layer) {
    return layer?.kind === "background" || layer?.id === BG_LAYER_ID;
  }

  function pinBackgroundBottom() {
    const bg = layers.find(isBackgroundLayer);
    if (!bg) {
      layers.push(makeBackgroundLayer());
      return;
    }
    layers = layers.filter((l) => !isBackgroundLayer(l)).concat([bg]);
  }

  function movableMaxIndex() {
    return Math.max(0, layers.length - 2);
  }

  function assetUrl(file) {
    return IMG_DIR + encodeURIComponent(file).replace(/%2F/gi, "/");
  }

  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value == null) continue;
      if (key === "text") node.textContent = value;
      else if (key === "html") node.innerHTML = value;
      else if (key === "dataset") Object.assign(node.dataset, value);
      else if (key.startsWith("on") && typeof value === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key.includes("-")) node.setAttribute(key, value);
      else node[key] = value;
    }
    for (const child of children.flat()) {
      if (child) node.append(child);
    }
    return node;
  }

  function makeThumb(className, file, extra = {}) {
    return el("img", { className, alt: "", src: assetUrl(file), ...extra });
  }

  function makeMatRow({ className, label, ariaLabel, extraNodes = [], onClick, file }) {
    return el(
      "button",
      {
        type: "button",
        className,
        "aria-label": ariaLabel,
        onclick: onClick,
      },
      makeThumb("mat-thumb", file, { loading: "lazy" }),
      el("span", { className: "mat-label", text: label }),
      ...extraNodes
    );
  }

  function makeLayerMeta(title, sub) {
    return el(
      "div",
      { className: "layer-meta" },
      el("div", { className: "layer-title", text: title }),
      el("div", { className: "layer-sub", text: sub })
    );
  }

  const materialsEl = document.getElementById("materials");
  const materialsStatusEl = document.getElementById("materials-status");
  const materialsCountEl = document.getElementById("materials-count");
  const layersCountEl = document.getElementById("layers-count");
  const materialsToggle = document.getElementById("materials-toggle");
  const materialsPanel = document.getElementById("materials-panel");
  const layersEl = document.getElementById("layers");
  const layersEmptyEl = document.getElementById("layers-empty");
  const canvas = document.getElementById("preview");
  const ctx = canvas.getContext("2d");
  const faviconEl = document.getElementById("favicon");
  const previewSlot = document.getElementById("preview-slot");
  const previewFrame = document.getElementById("preview-frame");
  const previewBlock = document.querySelector(".preview-block");
  const btnFinish = document.getElementById("btn-finish");
  const modal = document.getElementById("modal");
  const resultImage = document.getElementById("result-image");

  const MINI_VIEWPORT_RATIO = 1 / 3;
  let dockProgress = 1;
  let dockNeedsTick = false;
  let naturalSize = { width: 0, height: 0 };

  const WIDE_LAYOUT = "(min-width: 1100px)";

  function isWideLayout() {
    return window.matchMedia(WIDE_LAYOUT).matches;
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    const x = clamp(t, 0, 1);
    return x * x * (3 - 2 * x);
  }

  function bgAlpha(layer) {
    const opacity = Number(layer.opacity);
    if (!Number.isFinite(opacity)) return 1;
    return clamp(opacity / 255, 0, 1);
  }

  function resetPreviewFrame() {
    previewFrame.classList.remove("is-floating", "is-mini", "is-home");
    previewFrame.style.cssText = "";
    previewSlot.style.width = "";
    previewSlot.style.height = "";
  }

  function captureNaturalSize() {
    resetPreviewFrame();
    const r = previewFrame.getBoundingClientRect();
    naturalSize = { width: r.width, height: r.height };
    return naturalSize;
  }

  function pinSlot() {
    if (!naturalSize.width) captureNaturalSize();
    previewSlot.style.width = `${naturalSize.width}px`;
    previewSlot.style.height = `${naturalSize.height}px`;
  }

  function getMiniPose() {
    const n = naturalSize;
    const miniWidth = window.innerWidth * MINI_VIEWPORT_RATIO;
    const scale = Math.min(1, miniWidth / Math.max(n.width, 1));
    return {
      left: 16,
      top: window.innerHeight - 16 - n.height * scale,
      scale,
    };
  }

  function getHomePose() {
    const r = previewSlot.getBoundingClientRect();
    return { left: r.left, top: r.top, scale: 1 };
  }

  function canPageScroll() {
    return document.documentElement.scrollHeight > window.innerHeight + 2;
  }

  function visibilityProgress() {
    const r = previewSlot.getBoundingClientRect();
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    if (!canPageScroll()) {
      return visible > 0 ? 1 : 0;
    }
    return clamp(visible / Math.max(r.height, 1), 0, 1);
  }

  function applyPose(next) {
    previewFrame.classList.add("is-floating");
    previewFrame.style.left = `${next.left}px`;
    previewFrame.style.top = `${next.top}px`;
    previewFrame.style.width = `${naturalSize.width}px`;
    previewFrame.style.height = `${naturalSize.height}px`;
    previewFrame.style.right = "auto";
    previewFrame.style.bottom = "auto";
    previewFrame.style.transform = `scale(${next.scale})`;
  }

  function settleHome() {
    resetPreviewFrame();
  }

  function updatePreviewDock() {
    if (!previewFrame || !previewSlot) return;
    if (isWideLayout()) {
      settleHome();
      dockProgress = 1;
      return;
    }
    if (!naturalSize.width) captureNaturalSize();

    const raw = visibilityProgress();
    dockProgress = prefersReducedMotion() ? (raw >= 0.55 ? 1 : 0) : smoothstep(raw);

    if (dockProgress >= 0.999) {
      settleHome();
      return;
    }

    pinSlot();
    const mini = getMiniPose();
    const home = getHomePose();
    const scale = lerp(mini.scale, home.scale, dockProgress);
    const visualHeight = naturalSize.height * scale;
    const topLimit = window.innerHeight - 16 - visualHeight;
    const top = Math.min(
      lerp(mini.top, home.top, dockProgress),
      mini.top,
      topLimit
    );
    applyPose({
      left: lerp(mini.left, home.left, dockProgress),
      top,
      scale,
    });
    previewFrame.classList.toggle("is-mini", dockProgress < 0.08);
    previewFrame.classList.toggle("is-home", dockProgress > 0.92);
  }

  function requestDockTick() {
    if (dockNeedsTick) return;
    dockNeedsTick = true;
    requestAnimationFrame(() => {
      dockNeedsTick = false;
      updatePreviewDock();
    });
  }

  function setupPreviewDock() {
    if (!previewFrame || !previewSlot) return;
    captureNaturalSize();
    updatePreviewDock();

    window.addEventListener("scroll", requestDockTick, { passive: true });
    window.addEventListener("resize", () => {
      captureNaturalSize();
      requestDockTick();
    });
    window.matchMedia(WIDE_LAYOUT).addEventListener("change", () => {
      captureNaturalSize();
      requestDockTick();
    });

    if (typeof ResizeObserver === "function") {
      const ro = new ResizeObserver(() => requestDockTick());
      ro.observe(document.documentElement);
      ro.observe(materialsPanel);
      ro.observe(previewSlot);
    }

    previewFrame.addEventListener("click", () => {
      if (dockProgress >= 0.98) return;
      previewBlock?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
    });
  }

  function setMaterialsFolded(folded) {
    if (!materialsPanel || !materialsToggle) return;
    materialsToggle.setAttribute("aria-expanded", folded ? "false" : "true");
    materialsPanel.classList.toggle("is-folded", folded);
    requestAnimationFrame(() => {
      captureNaturalSize();
      requestDockTick();
    });
  }

  materialsToggle.addEventListener("click", () => {
    const open = materialsToggle.getAttribute("aria-expanded") !== "false";
    setMaterialsFolded(open);
  });

  function parseFileName(file) {
    const locked = isFixedFile(file);
    let base = fileBaseName(file).replace(/\.png$/i, "");
    if (locked) {
      base = base.slice(FIXED_PREFIX.length).replace(/^_/, "");
    }
    const idx = base.indexOf("_");
    if (idx === -1) {
      return { file, group: base, part: null, label: base, locked };
    }
    const group = base.slice(0, idx);
    const part = base.slice(idx + 1);
    return { file, group, part, label: part || group, locked };
  }

  function groupAssets(list) {
    const map = new Map();
    for (const item of list) {
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

  function whenImageReady(img, file) {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`failed: ${file}`));
    });
  }

  function loadImage(file) {
    if (imageCache.has(file)) return imageCache.get(file);
    const img = new Image();
    img.decoding = "async";
    img.src = assetUrl(file);
    imageCache.set(file, img);
    img._ready = img.decode
      ? img.decode().catch(() => whenImageReady(img, file))
      : whenImageReady(img, file);
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

  function updateFavicon() {
    if (!faviconEl) return;
    try {
      faviconEl.href = canvas.toDataURL("image/png");
    } catch {
      /* keep the fallback favicon when the canvas cannot be exported */
    }
  }

  async function renderPreview() {
    const currentRenderVersion = ++renderVersion;
    ctx.clearRect(0, 0, SIZE, SIZE);
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      if (isBackgroundLayer(layer)) {
        const alpha = bgAlpha(layer);
        if (alpha <= 0) continue;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = layer.color || "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.restore();
        continue;
      }
      const img = loadImage(layer.file);
      try {
        await img._ready;
        if (currentRenderVersion !== renderVersion) return;
        drawContain(img, ctx, SIZE);
      } catch {
        /* skip broken asset */
      }
    }
    if (currentRenderVersion !== renderVersion) return;
    updateFavicon();
    btnFinish.disabled = layers.length === 0;
  }

  function isAssetAdded(asset) {
    return layers.some((l) => l.file === asset.file);
  }

  function addAsset(asset) {
    if (isAssetAdded(asset)) {
      const groupItems = assets.filter((a) => a.group === asset.group);
      const asGroup = groupItems.length === 1;
      const ok = window.confirm(
        asGroup
          ? "すでにこのグループは追加されています　追加しますか？"
          : "すでにこのパーツは追加されています　追加しますか？"
      );
      if (!ok) return;
    }
    layers.unshift(makeLayer(asset));
    loadImage(asset.file);
    renderLayers();
    renderPreview();
  }

  function countableLayerCount() {
    return layers.filter((l) => !isBackgroundLayer(l) && !isFixedLayer(l)).length;
  }

  function updatePartCounts() {
    materialsCountEl.textContent = `${assets.length}パーツ`;
    layersCountEl.textContent = `${countableLayerCount()}パーツ`;
  }

  function addGroup(groupName) {
    const items = assets.filter((a) => a.group === groupName);
    const missing = items.filter((item) => !isAssetAdded(item));

    let incomingItems = missing;
    if (missing.length === 0) {
      const ok = window.confirm(
        "すでにこのグループは追加されています　追加しますか？"
      );
      if (!ok) return;
      incomingItems = items;
    }

    const incoming = incomingItems.map((item) => {
      loadImage(item.file);
      return makeLayer(item);
    });
    layers = incoming.concat(layers);
    renderLayers();
    renderPreview();
  }

  function removeLayer(id) {
    const target = layers.find((l) => l.id === id);
    if (!target || isBackgroundLayer(target) || isFixedLayer(target)) {
      return;
    }
    layers = layers.filter((l) => l.id !== id);
    renderLayers();
    renderPreview();
  }

  function reorderLayers(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || toIndex < 0) return;
    const max = movableMaxIndex();
    if (fromIndex > max || toIndex > max) return;
    const next = layers.slice();
    const [item] = next.splice(fromIndex, 1);
    if (isBackgroundLayer(item)) return;
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
    for (const node of items) {
      node.style.transform = "";
      node.classList.remove("is-dragging", "is-shifting");
    }
  }

  function applyDragShifts(state) {
    const { fromIndex, toIndex, slot, items, el: dragging } = state;
    items.forEach((item, i) => {
      if (item === dragging) return;
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
    const max = movableMaxIndex();
    let toIndex = fromIndex;

    for (let i = 0; i <= max; i++) {
      if (i === fromIndex) continue;
      if (i < fromIndex && y < mids[i]) {
        toIndex = i;
        break;
      }
      if (i > fromIndex && y > mids[i]) {
        toIndex = i;
      }
    }
    return Math.min(toIndex, max);
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
    const { fromIndex, toIndex, items, pointerId } = dragState;
    const handle = e.currentTarget;
    try {
      handle.releasePointerCapture(pointerId);
    } catch {
      /* already released */
    }
    handle.removeEventListener("pointermove", onDragMove);
    handle.removeEventListener("pointerup", onDragEnd);
    handle.removeEventListener("pointercancel", onDragEnd);

    clearDragTransforms(items);
    dragState = null;

    reorderLayers(fromIndex, toIndex);
    renderLayers();
    renderPreview();
  }

  function readGapPx(node) {
    const style = getComputedStyle(node);
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
    if (dragState) return;

    const layer = layers.find((l) => l.id === layerId);
    if (!layer || isBackgroundLayer(layer)) return;

    const items = [...layersEl.querySelectorAll(".layer-item")];
    const fromIndex = items.indexOf(li);
    if (fromIndex < 0 || fromIndex > movableMaxIndex()) return;

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
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.addEventListener("pointermove", onDragMove);
    e.currentTarget.addEventListener("pointerup", onDragEnd);
    e.currentTarget.addEventListener("pointercancel", onDragEnd);
    e.preventDefault();
  }

  function renderMaterials() {
    materialsEl.replaceChildren();
    for (const [groupName, items] of groupAssets(assets)) {
      const groupLi = el("li", { className: "mat-group" });
      if (items.length === 1) {
        const item = items[0];
        groupLi.append(
          makeMatRow({
            className: "mat-row mat-row-group",
            label: item.group,
            ariaLabel: `${item.label}を追加`,
            file: item.file,
            onClick: () => addAsset(item),
          })
        );
      } else {
        groupLi.append(
          makeMatRow({
            className: "mat-row mat-row-group",
            label: groupName,
            ariaLabel: `${groupName}グループをすべて追加`,
            file: items[0].file,
            extraNodes: [
              el("span", { className: "mat-meta", text: `${items.length}点` }),
            ],
            onClick: () => addGroup(groupName),
          }),
          el(
            "ul",
            { className: "mat-parts" },
            ...items.map((item) =>
              el(
                "li",
                {},
                makeMatRow({
                  className: "mat-row mat-row-part",
                  label: item.part ?? item.group,
                  ariaLabel: `${item.label}を追加`,
                  file: item.file,
                  onClick: () => addAsset(item),
                })
              )
            )
          )
        );
      }
      materialsEl.append(groupLi);
    }
    updatePartCounts();
  }

  function renderLayers() {
    layersEl.replaceChildren();
    updatePartCounts();
    pinBackgroundBottom();
    layersEmptyEl.hidden = layers.length > 0;

    layers.forEach((layer) => {
      const li = el("li", { className: "layer-item", dataset: { id: layer.id } });

      if (isBackgroundLayer(layer)) {
        li.classList.add("is-background");
        const color = layer.color || "#ffffff";
        const swatch = el("div", { className: "layer-swatch" });
        swatch.style.setProperty("--swatch-color", color);
        swatch.style.setProperty("--swatch-opacity", String(bgAlpha(layer)));

        const colorInput = el("input", {
          type: "color",
          value: color,
          "aria-label": "カラーパレット",
          oninput: () => {
            layer.color = colorInput.value;
            swatch.style.setProperty("--swatch-color", layer.color);
            renderPreview();
          },
        });
        const opacityInput = el("input", {
          type: "range",
          min: "0",
          max: "255",
          step: "1",
          value: String(Math.round(clamp(Number(layer.opacity) ?? 255, 0, 255))),
          "aria-label": "不透明度",
        });
        const opacityValue = el("span", {
          className: "layer-bg-opacity-value",
          text: opacityInput.value,
        });
        opacityInput.addEventListener("input", () => {
          layer.opacity = Number(opacityInput.value);
          opacityValue.textContent = opacityInput.value;
          swatch.style.setProperty("--swatch-opacity", String(layer.opacity / 255));
          renderPreview();
        });

        li.append(
          swatch,
          makeLayerMeta("背景色", "最背面・移動不可"),
          el(
            "div",
            { className: "layer-controls layer-bg-controls" },
            el(
              "label",
              { className: "layer-bg-field", title: "カラーパレット" },
              el("span", { text: "カラーパレット" }),
              colorInput
            ),
            el(
              "label",
              {
                className: "layer-bg-field layer-bg-opacity",
                title: "不透明度（0で透明・255で不透明）",
              },
              el("span", { text: "不透明度" }),
              opacityInput,
              opacityValue
            )
          )
        );
        layersEl.append(li);
        return;
      }

      const thumb = makeThumb("layer-thumb", layer.file, { draggable: false });
      const handle = el("button", {
        type: "button",
        className: "layer-handle",
        "aria-label": "ドラッグして入れ替え",
        title: "ドラッグして入れ替え",
        html: '<span aria-hidden="true" class="layer-handle-bars"></span>',
        onpointerdown: (ev) => startLayerDrag(ev, layer.id, li),
      });
      const meta = makeLayerMeta(
        layer.label,
        layer.part ? `${layer.group} / ${layer.part}` : layer.group
      );

      if (!isFixedLayer(layer)) {
        const del = el("button", {
          type: "button",
          className: "layer-btn is-danger",
          text: "削除",
          onclick: (ev) => {
            ev.stopPropagation();
            removeLayer(layer.id);
          },
        });
        li.append(el("div", { className: "layer-side-left" }, del), thumb, meta, handle);
      } else {
        li.classList.add("is-base");
        li.append(thumb, meta, handle);
      }
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

    const parsed = raw
      .filter((f) => typeof f === "string" && /\.png$/i.test(f))
      .map(parseFileName);
    assets = parsed.filter((a) => !a.locked);
    const fixedAssets = parsed.filter((a) => a.locked);
    layers = fixedAssets.map(makeLayer).concat([makeBackgroundLayer()]);
    for (const asset of fixedAssets) {
      loadImage(asset.file);
    }

    setStatus("");
    renderMaterials();
    renderLayers();
    renderPreview();
    setupPreviewDock();
  }

  init();
})();
