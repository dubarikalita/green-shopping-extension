(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // categoryDetector.js
  var require_categoryDetector = __commonJS({
    "categoryDetector.js"(exports, module) {
      function detectCategory2() {
        var _a2, _b, _c, _d;
        const title = ((_b = (_a2 = document.querySelector(
          '#productTitle, h1, [itemprop="name"], [class*="title"], [class*="product-title"]'
        )) == null ? void 0 : _a2.innerText) == null ? void 0 : _b.toLowerCase()) || "";
        const url = window.location.href.toLowerCase();
        const breadcrumb = ((_d = (_c = document.querySelector(
          '#wayfinding-breadcrumbs_feature_div, nav[aria-label="breadcrumb"], [class*="breadcrumb"]'
        )) == null ? void 0 : _c.innerText) == null ? void 0 : _d.toLowerCase()) || "";
        const text = `${title} ${url} ${breadcrumb}`;
        if (text.match(/bottle|flask|tumbler|thermos|water.?bottle/)) return "water-bottle";
        if (text.match(/toothbrush|dental|oral.?care/)) return "beauty";
        if (text.match(/shirt|dress|pant|jacket|clothing|apparel|t-shirt|jeans/)) return "clothing";
        if (text.match(/moisturizer|serum|shampoo|beauty|skincare|makeup|lotion/)) return "beauty";
        if (text.match(/bag|backpack|tote|purse|handbag|luggage/)) return "bags";
        if (text.match(/shoe|sneaker|boot|sandal|footwear/)) return "footwear";
        if (text.match(/phone|laptop|tablet|electronic|charger|cable/)) return "electronics";
        return "general";
      }
      module.exports = { detectCategory: detectCategory2 };
    }
  });

  // api.js
  var require_api = __commonJS({
    "api.js"(exports, module) {
      var API_BASE = "http://localhost:3000";
      async function fetchScore2(title, description, brand, category = "water-bottle") {
        try {
          const params = new URLSearchParams({ title, description, brand, category });
          const res = await fetch(`${API_BASE}/score?${params}`);
          if (!res.ok) throw new Error("Score fetch failed");
          return res.json();
        } catch (err) {
          console.error("fetchScore error:", err);
          return { score: 0, breakdown: {}, greenwashingDetected: false, source: "error" };
        }
      }
      async function fetchAlternatives2(category) {
        try {
          const params = new URLSearchParams({ category });
          const res = await fetch(`${API_BASE}/alternatives?${params}`);
          if (!res.ok) throw new Error("Alternatives fetch failed");
          return res.json();
        } catch (err) {
          console.error("fetchAlternatives error:", err);
          return { alternatives: [] };
        }
      }
      module.exports = { fetchScore: fetchScore2, fetchAlternatives: fetchAlternatives2 };
    }
  });

  // storage.js
  var require_storage = __commonJS({
    "storage.js"(exports, module) {
      async function getPreferences2() {
        return new Promise((resolve) => {
          chrome.storage.local.get(["preferences"], (result) => {
            resolve(result.preferences || { priorities: [], savedProducts: [] });
          });
        });
      }
      async function savePreferences2(prefs) {
        return new Promise((resolve) => {
          chrome.storage.local.set({ preferences: prefs }, resolve);
        });
      }
      async function saveProduct2(product) {
        const prefs = await getPreferences2();
        const alreadySaved = prefs.savedProducts.find((p) => p.url === product.url);
        if (!alreadySaved) {
          prefs.savedProducts.push({ ...product, savedAt: (/* @__PURE__ */ new Date()).toISOString() });
          await savePreferences2(prefs);
        }
      }
      async function removeSavedProduct(url) {
        const prefs = await getPreferences2();
        prefs.savedProducts = prefs.savedProducts.filter((p) => p.url !== url);
        await savePreferences2(prefs);
      }
      module.exports = { getPreferences: getPreferences2, savePreferences: savePreferences2, saveProduct: saveProduct2, removeSavedProduct };
    }
  });

  // sites/amazon.js
  var require_amazon = __commonJS({
    "sites/amazon.js"(exports, module) {
      function extractAmazonProduct() {
        var _a2, _b, _c, _d, _e, _f, _g;
        const title = ((_b = (_a2 = document.querySelector("#productTitle")) == null ? void 0 : _a2.innerText) == null ? void 0 : _b.trim()) || "";
        const brand = ((_d = (_c = document.querySelector("#bylineInfo")) == null ? void 0 : _c.innerText) == null ? void 0 : _d.trim()) || "";
        const price = ((_f = (_e = document.querySelector(".a-price .a-offscreen")) == null ? void 0 : _e.innerText) == null ? void 0 : _f.trim()) || "";
        const descriptionParts = [];
        document.querySelectorAll("#feature-bullets li span").forEach((el) => {
          descriptionParts.push(el.innerText.trim());
        });
        const description = descriptionParts.join(" ");
        const image = ((_g = document.querySelector("#landingImage")) == null ? void 0 : _g.src) || "";
        return { title, brand, price, description, image, site: "amazon" };
      }
      module.exports = { extractAmazonProduct };
    }
  });

  // sites/flipkart.js
  var require_flipkart = __commonJS({
    "sites/flipkart.js"(exports, module) {
      function extractFlipkartProduct() {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        const title = ((_b = (_a2 = document.querySelector('[class*="VU-ZEz"]')) == null ? void 0 : _a2.innerText) == null ? void 0 : _b.trim()) || ((_d = (_c = document.querySelector('[class*="title"] h1')) == null ? void 0 : _c.innerText) == null ? void 0 : _d.trim()) || ((_f = (_e = document.querySelector("h1")) == null ? void 0 : _e.innerText) == null ? void 0 : _f.trim()) || ((_h = (_g = document.querySelector('[itemprop="name"]')) == null ? void 0 : _g.innerText) == null ? void 0 : _h.trim()) || ((_j = (_i = document.title) == null ? void 0 : _i.split("|")[0]) == null ? void 0 : _j.trim()) || "";
        const brand = ((_l = (_k = document.querySelector('[class*="mEh187"]')) == null ? void 0 : _k.innerText) == null ? void 0 : _l.trim()) || ((_n = (_m = document.querySelector('[class*="brand"]')) == null ? void 0 : _m.innerText) == null ? void 0 : _n.trim()) || title.split(" ")[0] || // fallback: first word of title is usually brand
        "";
        const price = ((_p = (_o = document.querySelector('[class*="Nx9bqj"]')) == null ? void 0 : _o.innerText) == null ? void 0 : _p.trim()) || ((_r = (_q = document.querySelector('[class*="CEmiEU"]')) == null ? void 0 : _q.innerText) == null ? void 0 : _r.trim()) || ((_t = (_s = document.querySelector('[class*="price"]')) == null ? void 0 : _s.innerText) == null ? void 0 : _t.trim()) || "";
        const descriptionParts = [];
        document.querySelectorAll('[class*="xFVion"] li, [class*="_2cLu-l"] li, [class*="highlights"] li').forEach((el) => {
          descriptionParts.push(el.innerText.trim());
        });
        const description = descriptionParts.join(" ") || ((_v = (_u = document.querySelector('[class*="description"]')) == null ? void 0 : _u.innerText) == null ? void 0 : _v.trim()) || "";
        const image = ((_w = document.querySelector('img[class*="DByuf4"]')) == null ? void 0 : _w.src) || ((_x = document.querySelector('img[class*="product"]')) == null ? void 0 : _x.src) || "";
        return { title, brand, price, description, image, site: "flipkart" };
      }
      module.exports = { extractFlipkartProduct };
    }
  });

  // sites/etsy.js
  var require_etsy = __commonJS({
    "sites/etsy.js"(exports, module) {
      function extractEtsyProduct() {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        const title = ((_b = (_a2 = document.querySelector("h1[data-buy-box-listing-title]")) == null ? void 0 : _a2.innerText) == null ? void 0 : _b.trim()) || ((_d = (_c = document.querySelector("h1.wt-text-body-03")) == null ? void 0 : _c.innerText) == null ? void 0 : _d.trim()) || ((_f = (_e = document.querySelector("h1")) == null ? void 0 : _e.innerText) == null ? void 0 : _f.trim()) || ((_h = (_g = document.title) == null ? void 0 : _g.split("|")[0]) == null ? void 0 : _h.trim()) || "";
        const brand = ((_j = (_i = document.querySelector('a[href*="/shop/"]')) == null ? void 0 : _i.innerText) == null ? void 0 : _j.trim()) || ((_l = (_k = document.querySelector('[class*="shop-name"]')) == null ? void 0 : _k.innerText) == null ? void 0 : _l.trim()) || "";
        const price = ((_n = (_m = document.querySelector('[data-selector="price-only"]')) == null ? void 0 : _m.innerText) == null ? void 0 : _n.trim()) || ((_p = (_o = document.querySelector(".wt-text-title-03")) == null ? void 0 : _o.innerText) == null ? void 0 : _p.trim()) || ((_r = (_q = document.querySelector('[class*="price"]')) == null ? void 0 : _q.innerText) == null ? void 0 : _r.trim()) || "";
        const description = ((_t = (_s = document.querySelector("#wt-content-toggle-product-details-read-more p")) == null ? void 0 : _s.innerText) == null ? void 0 : _t.trim()) || ((_v = (_u = document.querySelector('[class*="listing-description"]')) == null ? void 0 : _u.innerText) == null ? void 0 : _v.trim()) || ((_x = (_w = document.querySelector('p[class*="description"]')) == null ? void 0 : _w.innerText) == null ? void 0 : _x.trim()) || "";
        const image = ((_y = document.querySelector('img[data-src*="listing"]')) == null ? void 0 : _y.src) || ((_z = document.querySelector(".wt-max-width-full img")) == null ? void 0 : _z.src) || "";
        return { title, brand, price, description, image, site: "etsy" };
      }
      module.exports = { extractEtsyProduct };
    }
  });

  // sites/google.js
  var require_google = __commonJS({
    "sites/google.js"(exports, module) {
      function extractGoogleShoppingProduct() {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        const title = ((_b = (_a2 = document.querySelector("h1.sh-np__product-title")) == null ? void 0 : _a2.innerText) == null ? void 0 : _b.trim()) || ((_d = (_c = document.querySelector('h1[class*="product"]')) == null ? void 0 : _c.innerText) == null ? void 0 : _d.trim()) || ((_f = (_e = document.querySelector("h1")) == null ? void 0 : _e.innerText) == null ? void 0 : _f.trim()) || ((_h = (_g = document.title) == null ? void 0 : _g.split("-")[0]) == null ? void 0 : _h.trim()) || "";
        const brand = ((_j = (_i = document.querySelector(".sh-np__seller-info")) == null ? void 0 : _i.innerText) == null ? void 0 : _j.trim()) || ((_l = (_k = document.querySelector('[class*="brand"]')) == null ? void 0 : _k.innerText) == null ? void 0 : _l.trim()) || "";
        const price = ((_n = (_m = document.querySelector('[aria-label*="$"], [aria-label*="\u20B9"]')) == null ? void 0 : _m.innerText) == null ? void 0 : _n.trim()) || ((_p = (_o = document.querySelector(".sh-np__price")) == null ? void 0 : _o.innerText) == null ? void 0 : _p.trim()) || ((_r = (_q = document.querySelector('[class*="price"]')) == null ? void 0 : _q.innerText) == null ? void 0 : _r.trim()) || "";
        const description = ((_t = (_s = document.querySelector(".sh-ds__desc")) == null ? void 0 : _s.innerText) == null ? void 0 : _t.trim()) || ((_v = (_u = document.querySelector('[data-attrid="description"]')) == null ? void 0 : _u.innerText) == null ? void 0 : _v.trim()) || ((_x = (_w = document.querySelector('[class*="description"]')) == null ? void 0 : _w.innerText) == null ? void 0 : _x.trim()) || "";
        const image = ((_y = document.querySelector(".sh-div__image img")) == null ? void 0 : _y.src) || "";
        return { title, brand, price, description, image, site: "google" };
      }
      module.exports = { extractGoogleShoppingProduct };
    }
  });

  // sites/index.js
  var require_sites = __commonJS({
    "sites/index.js"(exports, module) {
      var { extractAmazonProduct } = require_amazon();
      var { extractFlipkartProduct } = require_flipkart();
      var { extractEtsyProduct } = require_etsy();
      var { extractGoogleShoppingProduct } = require_google();
      function extractProductData2() {
        const url = window.location.hostname;
        if (url.includes("amazon")) return extractAmazonProduct();
        if (url.includes("flipkart")) return extractFlipkartProduct();
        if (url.includes("etsy")) return extractEtsyProduct();
        if (url.includes("google")) return extractGoogleShoppingProduct();
        return null;
      }
      module.exports = { extractProductData: extractProductData2 };
    }
  });

  // content.js
  var { detectCategory } = require_categoryDetector();
  var { fetchScore, fetchAlternatives } = require_api();
  var { getPreferences, saveProduct } = require_storage();
  var { extractProductData } = require_sites();
  async function analyzeProduct() {
    var _a2;
    const product = extractProductData();
    if (!product || !product.title) {
      console.log("Green Shopping: No product found on this page.");
      return;
    }
    const category = detectCategory();
    const prefs = await getPreferences();
    try {
      const [scoreData, altData] = await Promise.all([
        fetchScore(product.title, product.description, product.brand, category),
        fetchAlternatives(category)
      ]);
      displayScore(scoreData, prefs);
      displayAlternatives(altData.alternatives, product);
      const sourceBadge = document.getElementById("score-source");
      if (sourceBadge) {
        sourceBadge.textContent = scoreData.source === "ai" ? "\u{1F916} AI Analysis" : "\u{1F50D} Keyword Match";
      }
      if (scoreData.summary) {
        const summaryEl = document.getElementById("ai-summary");
        if (summaryEl) summaryEl.textContent = scoreData.summary;
      }
      if ((_a2 = scoreData.improvements) == null ? void 0 : _a2.length) {
        const impEl = document.getElementById("ai-improvements");
        if (impEl) {
          impEl.innerHTML = scoreData.improvements.map((i) => `<li>${i}</li>`).join("");
        }
      }
    } catch (err) {
      console.error("Green Shopping: Analysis failed:", err);
    }
  }
  analyzeProduct();
  async function showComparison(currentProduct, alternativeProduct) {
    document.getElementById("comparison-panel").style.display = "block";
    document.getElementById("compare-current-name").textContent = currentProduct.title || "Current Product";
    document.getElementById("compare-current-score").textContent = currentProduct.score || "?";
    document.getElementById("compare-current-tags").textContent = (currentProduct.tags || []).join(", ");
    document.getElementById("compare-alt-name").textContent = alternativeProduct.name;
    document.getElementById("compare-alt-score").textContent = alternativeProduct.score;
    document.getElementById("compare-alt-tags").textContent = (alternativeProduct.tags || []).join(", ");
    const diff = alternativeProduct.score - (currentProduct.score || 0);
    document.getElementById("compare-verdict").textContent = diff > 0 ? `\u{1F33F} ${alternativeProduct.name} scores ${diff} points higher \u2014 a greener choice.` : `Current product is already a strong choice.`;
    document.getElementById("close-compare").addEventListener("click", () => {
      document.getElementById("comparison-panel").style.display = "none";
    });
  }
  var selectedHelpful = null;
  document.querySelectorAll(".feedback-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedHelpful = btn.dataset.helpful === "true";
      document.querySelectorAll(".feedback-btn").forEach((b) => b.style.fontWeight = "normal");
      btn.style.fontWeight = "700";
    });
  });
  var _a;
  (_a = document.getElementById("submit-feedback")) == null ? void 0 : _a.addEventListener("click", async () => {
    const comment = document.getElementById("feedback-comment").value;
    await fetch("http://localhost:3000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        helpful: selectedHelpful,
        comment,
        site: window.location.hostname
      })
    });
    document.getElementById("feedback-thanks").style.display = "block";
    document.getElementById("submit-feedback").style.display = "none";
  });
  document.querySelectorAll(".compare-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const alt = JSON.parse(btn.dataset.alt);
      const current = JSON.parse(btn.dataset.current);
      showComparison(current, alt);
    });
  });
})();
