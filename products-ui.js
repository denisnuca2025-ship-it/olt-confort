(function () {
  const gridEl = document.getElementById("products-grid");
  const modal = document.getElementById("product-modal");
  if (!gridEl || !modal || !window.PRODUCTS_CATALOG) return;

  const backdrop = modal.querySelector(".product-modal-backdrop");
  const closeBtn = modal.querySelector(".product-modal-close");
  const titleEl = modal.querySelector("#product-modal-title");
  const priceEl = modal.querySelector(".product-modal-price");
  const bodyEl = modal.querySelector(".product-modal-body");
  const sliderRoot = modal.querySelector(".product-modal-slider");

  let sliderState = { index: 0, images: [] };

  function buildSlider(images, altBase) {
    sliderRoot.innerHTML = "";
    if (!images || images.length === 0) {
      images = [
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1000&q=80"
      ];
    }
    sliderState.images = images;
    sliderState.index = 0;

    const viewport = document.createElement("div");
    viewport.className = "p-slider-viewport";
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute(
      "aria-label",
      altBase ? "Imagini: " + altBase : "Imagini produs"
    );

    const track = document.createElement("div");
    track.className = "p-slider-track";
    const nImg = images.length;
    viewport.style.setProperty("--p-slides", String(nImg));

    images.forEach((src, i) => {
      const slide = document.createElement("div");
      slide.className = "p-slider-slide";
      slide.setAttribute("aria-hidden", i === 0 ? "false" : "true");
      const img = document.createElement("img");
      img.src = src;
      img.alt = altBase
        ? altBase + " — " + (i + 1) + "/" + nImg
        : "Produs " + (i + 1) + "/" + nImg;
      img.loading = "lazy";
      img.decoding = "async";
      slide.appendChild(img);
      track.appendChild(slide);
    });

    viewport.appendChild(track);

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "p-slider-btn p-slider-prev";
    prev.setAttribute("aria-label", "Imaginea anterioară");
    prev.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>';

    const next = document.createElement("button");
    next.type = "button";
    next.className = "p-slider-btn p-slider-next";
    next.setAttribute("aria-label", "Imaginea următoare");
    next.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';

    const dots = document.createElement("div");
    dots.className = "p-slider-dots";
    images.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "p-slider-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Slide " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dots.appendChild(dot);
    });

    function updateSlider() {
      const n = images.length;
      const idx = ((sliderState.index % n) + n) % n;
      sliderState.index = idx;
      track.style.transform = "translateX(-" + (idx / n) * 100 + "%)";
      track.querySelectorAll(".p-slider-slide").forEach((s, i) => {
        s.setAttribute("aria-hidden", i === idx ? "false" : "true");
      });
      dots.querySelectorAll(".p-slider-dot").forEach((d, i) => {
        d.classList.toggle("is-active", i === idx);
      });
    }

    function goTo(i) {
      sliderState.index = i;
      updateSlider();
    }

    prev.addEventListener("click", () => goTo(sliderState.index - 1));
    next.addEventListener("click", () => goTo(sliderState.index + 1));

    let touchStartX = null;
    viewport.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    viewport.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].screenX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) < 40) return;
      if (dx > 0) goTo(sliderState.index - 1);
      else goTo(sliderState.index + 1);
    });

    sliderRoot.appendChild(viewport);
    sliderRoot.appendChild(prev);
    sliderRoot.appendChild(next);
    sliderRoot.appendChild(dots);

    updateSlider();
  }

  function openModal(product) {
    titleEl.textContent = product.title;
    priceEl.textContent = "Preț: " + product.price;
    bodyEl.innerHTML = product.bodyHtml;
    buildSlider(product.images, product.title);
    modal.hidden = false;
    document.body.classList.add("product-modal-open");
    document.documentElement.style.overflow = "hidden";
    closeBtn.focus();
    history.replaceState(null, "", "#" + product.id);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("product-modal-open");
    document.documentElement.style.overflow = "";
    if (window.location.hash && window.location.hash.startsWith("#prod-")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  function renderGrid() {
    gridEl.innerHTML = "";
    window.PRODUCTS_CATALOG.forEach((p) => {
      const card = document.createElement("article");
      card.className = "product-card wood-panel";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Deschide detalii: " + p.title);

      const imgSrc = p.images && p.images[0] ? p.images[0] : "";
      const thumb = document.createElement("div");
      thumb.className = "product-card-thumb img-frame";
      const im = document.createElement("img");
      im.src = imgSrc;
      im.alt = p.title;
      im.loading = "lazy";
      thumb.appendChild(im);

      const content = document.createElement("div");
      content.className = "product-card-content";
      const h3 = document.createElement("h3");
      h3.className = "product-card-title";
      h3.textContent = p.title;
      const pr = document.createElement("p");
      pr.className = "product-card-price";
      pr.textContent = p.price;
      const ex = document.createElement("p");
      ex.className = "product-card-excerpt";
      ex.textContent = p.short;
      const hint = document.createElement("span");
      hint.className = "product-card-hint";
      hint.textContent = "Vezi detalii →";

      content.appendChild(h3);
      content.appendChild(pr);
      content.appendChild(ex);
      content.appendChild(hint);

      card.appendChild(thumb);
      card.appendChild(content);

      const open = () => openModal(p);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });

      gridEl.appendChild(card);
    });
  }

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  function tryOpenFromHash() {
    const h = window.location.hash.replace("#", "");
    if (!h || !h.startsWith("prod-")) return;
    const prod = window.PRODUCTS_CATALOG.find((x) => x.id === h);
    if (prod) openModal(prod);
  }

  renderGrid();
  window.addEventListener("hashchange", () => {
    if (modal.hidden) tryOpenFromHash();
  });

  if (document.readyState === "complete") {
    tryOpenFromHash();
  } else {
    window.addEventListener("load", tryOpenFromHash);
  }
})();
