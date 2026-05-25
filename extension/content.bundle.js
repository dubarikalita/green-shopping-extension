(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // categoryDetector.js
  var require_categoryDetector = __commonJS({
    "categoryDetector.js"(exports, module) {
      function detectCategory2() {
        var _a, _b, _c, _d;
        const title = ((_b = (_a = document.querySelector(
          '#productTitle, h1, [itemprop="name"], [class*="title"], [class*="product-title"]'
        )) == null ? void 0 : _a.innerText) == null ? void 0 : _b.toLowerCase()) || "";
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
      var API_BASE = "https://green-shopping-extension.onrender.com";
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
        var _a, _b, _c, _d, _e, _f, _g;
        const title = ((_b = (_a = document.querySelector("#productTitle")) == null ? void 0 : _a.innerText) == null ? void 0 : _b.trim()) || "";
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        const title = ((_b = (_a = document.querySelector('[class*="VU-ZEz"]')) == null ? void 0 : _a.innerText) == null ? void 0 : _b.trim()) || ((_d = (_c = document.querySelector('[class*="title"] h1')) == null ? void 0 : _c.innerText) == null ? void 0 : _d.trim()) || ((_f = (_e = document.querySelector("h1")) == null ? void 0 : _e.innerText) == null ? void 0 : _f.trim()) || ((_h = (_g = document.querySelector('[itemprop="name"]')) == null ? void 0 : _g.innerText) == null ? void 0 : _h.trim()) || ((_j = (_i = document.title) == null ? void 0 : _i.split("|")[0]) == null ? void 0 : _j.trim()) || "";
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        const title = ((_b = (_a = document.querySelector("h1[data-buy-box-listing-title]")) == null ? void 0 : _a.innerText) == null ? void 0 : _b.trim()) || ((_d = (_c = document.querySelector("h1.wt-text-body-03")) == null ? void 0 : _c.innerText) == null ? void 0 : _d.trim()) || ((_f = (_e = document.querySelector("h1")) == null ? void 0 : _e.innerText) == null ? void 0 : _f.trim()) || ((_h = (_g = document.title) == null ? void 0 : _g.split("|")[0]) == null ? void 0 : _h.trim()) || "";
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        const title = ((_b = (_a = document.querySelector("h1.sh-np__product-title")) == null ? void 0 : _a.innerText) == null ? void 0 : _b.trim()) || ((_d = (_c = document.querySelector('h1[class*="product"]')) == null ? void 0 : _c.innerText) == null ? void 0 : _d.trim()) || ((_f = (_e = document.querySelector("h1")) == null ? void 0 : _e.innerText) == null ? void 0 : _f.trim()) || ((_h = (_g = document.title) == null ? void 0 : _g.split("-")[0]) == null ? void 0 : _h.trim()) || "";
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
  var { getPreferences, savePreferences, saveProduct } = require_storage();
  var { extractProductData } = require_sites();
  function injectSidebar() {
    var _a;
    if (document.getElementById("green-assistant-sidebar")) return;
    const sidebar = document.createElement("div");
    sidebar.id = "green-assistant-sidebar";
    sidebar.innerHTML = `
    <div class="ga-header">
      <div class="ga-logo">Green Assistant</div>
      <button id="ga-close-sidebar" class="ga-close">x</button>
    </div>

    <div class="ga-body">
      <div id="eco-score" class="ga-score-circle" style="background:#9ca3af;">...</div>
      <div id="eco-rating" class="ga-score-label">Analyzing</div>

      <div id="score-source"></div>

      <div class="ga-section-title">Score Breakdown</div>
      <div id="score-breakdown" class="ga-breakdown"></div>

      <div class="ga-section-title">Signals</div>
      <div id="score-flags" class="ga-reasons"></div>

      <div id="ai-summary-section" style="padding:10px 0;">
        <div class="ga-section-title">AI Analysis</div>
        <p id="ai-summary" style="font-size:12px;color:#374151;line-height:1.5;"></p>
      </div>

      <div id="ai-improvements-section" style="padding:10px 0;">
        <div class="ga-section-title">How To Improve</div>
        <ul id="ai-improvements" style="font-size:12px;color:#374151;padding-left:16px;line-height:1.8;"></ul>
      </div>

      <div class="ga-section-title">Greener Alternatives</div>
      <div id="alternatives-container"></div>

      <div id="preferences-panel" style="padding-top:12px;">
        <div class="ga-section-title">Your Priorities</div>
        <div id="priority-tags" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
          <button class="priority-tag" data-value="vegan" style="border:1px solid #bbf7d0;background:#f8fafc;color:#166534;border-radius:999px;padding:4px 8px;font-size:12px;cursor:pointer;">Vegan</button>
          <button class="priority-tag" data-value="plastic-free" style="border:1px solid #bbf7d0;background:#f8fafc;color:#166534;border-radius:999px;padding:4px 8px;font-size:12px;cursor:pointer;">Plastic-free</button>
          <button class="priority-tag" data-value="carbon-neutral" style="border:1px solid #bbf7d0;background:#f8fafc;color:#166534;border-radius:999px;padding:4px 8px;font-size:12px;cursor:pointer;">Carbon Neutral</button>
          <button class="priority-tag" data-value="fair-trade" style="border:1px solid #bbf7d0;background:#f8fafc;color:#166534;border-radius:999px;padding:4px 8px;font-size:12px;cursor:pointer;">Fair Trade</button>
          <button class="priority-tag" data-value="cruelty-free" style="border:1px solid #bbf7d0;background:#f8fafc;color:#166534;border-radius:999px;padding:4px 8px;font-size:12px;cursor:pointer;">Cruelty-free</button>
        </div>

        <div class="ga-section-title">Saved Products</div>
        <div id="saved-products-list"></div>
      </div>

      <div id="comparison-panel" style="display:none;padding-top:12px;">
        <button id="close-compare" style="float:right;font-size:11px;">Close</button>
        <div class="ga-section-title">Comparison</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div style="padding:10px;border:1px solid #eee;border-radius:8px;background:#fff8f8;">
            <div style="font-size:10px;color:#999;margin-bottom:4px;">CURRENT</div>
            <div id="compare-current-name" style="font-size:12px;font-weight:600;"></div>
            <div id="compare-current-score" style="font-size:24px;font-weight:700;color:#e74c3c;margin:6px 0;"></div>
            <div id="compare-current-tags" style="font-size:11px;color:#666;"></div>
          </div>

          <div style="padding:10px;border:2px solid #16a34a;border-radius:8px;background:#f0fdf4;">
            <div style="font-size:10px;color:#16a34a;margin-bottom:4px;">BETTER CHOICE</div>
            <div id="compare-alt-name" style="font-size:12px;font-weight:600;"></div>
            <div id="compare-alt-score" style="font-size:24px;font-weight:700;color:#16a34a;margin:6px 0;"></div>
            <div id="compare-alt-tags" style="font-size:11px;color:#666;"></div>
          </div>
        </div>

        <div id="compare-verdict" style="margin-top:12px;font-size:12px;color:#555;text-align:center;"></div>
      </div>

      <div id="feedback-section" style="padding-top:12px;border-top:1px solid #e5e7eb;margin-top:12px;">
        <div class="ga-section-title">Was This Score Accurate?</div>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
          <button class="feedback-btn" data-helpful="true" style="flex:1;padding:8px;border:1px solid #bbf7d0;border-radius:6px;background:#f0fdf4;cursor:pointer;font-size:13px;">Yes</button>
          <button class="feedback-btn" data-helpful="false" style="flex:1;padding:8px;border:1px solid #fecaca;border-radius:6px;background:#fff8f8;cursor:pointer;font-size:13px;">No</button>
        </div>
        <input id="feedback-comment" placeholder="Optional comment..." style="width:100%;padding:7px 10px;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;margin-bottom:8px;">
        <button id="submit-feedback" style="width:100%;padding:8px;background:#16a34a;color:#fff;border:none;border-radius:6px;font-size:12px;cursor:pointer;">Submit Feedback</button>
        <div id="feedback-thanks" style="display:none;text-align:center;font-size:12px;color:#15803d;margin-top:6px;">Thanks for your feedback!</div>
      </div>
    </div>
  `;
    const tab = document.createElement("div");
    tab.id = "ga-toggle-tab";
    tab.textContent = "\u2618";
    document.body.appendChild(sidebar);
    document.body.appendChild(tab);
    (_a = document.getElementById("ga-close-sidebar")) == null ? void 0 : _a.addEventListener("click", () => {
      sidebar.classList.add("hidden");
      tab.style.display = "flex";
    });
    tab.addEventListener("click", () => {
      sidebar.classList.remove("hidden");
      tab.style.display = "none";
    });
    setupFeedbackHandlers();
  }
  async function analyzeProduct() {
    var _a;
    const product = extractProductData();
    if (!product || !product.title) {
      console.log("Green Shopping: No product found on this page.");
      return;
    }
    injectSidebar();
    await loadPreferencesUI();
    const category = detectCategory();
    const prefs = await getPreferences();
    try {
      const [scoreData, altData] = await Promise.all([
        fetchScore(product.title, product.description, product.brand, category),
        fetchAlternatives(category)
      ]);
      const currentProduct = {
        ...product,
        score: scoreData.score,
        tags: scoreData.tags || []
      };
      displayScore(scoreData, prefs);
      displayAlternatives(altData.alternatives || altData || [], currentProduct);
      const sourceBadge = document.getElementById("score-source");
      if (sourceBadge) {
        sourceBadge.textContent = scoreData.source === "ai" ? "AI Analysis" : "Keyword Match";
      }
      if (scoreData.summary) {
        const summaryEl = document.getElementById("ai-summary");
        if (summaryEl) summaryEl.textContent = scoreData.summary;
      }
      if ((_a = scoreData.improvements) == null ? void 0 : _a.length) {
        const impEl = document.getElementById("ai-improvements");
        if (impEl) {
          impEl.innerHTML = scoreData.improvements.map((i) => `<li>${escapeHtml(i)}</li>`).join("");
        }
      }
    } catch (err) {
      console.error("Green Shopping: Analysis failed:", err);
    }
  }
  function displayScore(scoreData, prefs) {
    var _a;
    const totalScore = Number(scoreData.score) || 0;
    const scoreColor = getScoreColor(totalScore);
    const scoreEl = document.getElementById("eco-score");
    if (scoreEl) {
      scoreEl.textContent = totalScore || "?";
      scoreEl.style.background = scoreColor;
    }
    const ratingEl = document.getElementById("eco-rating");
    if (ratingEl) ratingEl.textContent = scoreData.rating || getRatingLabel(totalScore);
    const breakdownEl = document.getElementById("score-breakdown");
    if (breakdownEl && scoreData.breakdown) {
      breakdownEl.innerHTML = Object.entries(scoreData.breakdown).map(([key, value]) => {
        const item = normalizeBreakdownItem(value);
        const fillColor = getScoreColor(item.percent);
        return `
          <div style="font-size:12px;margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;gap:8px;">
              <span>${escapeHtml(formatLabel(key))}</span>
              <span>${item.score}/${item.max}</span>
            </div>
            <div style="height:6px;background:#e5e7eb;border-radius:99px;overflow:hidden;">
              <div style="height:100%;width:${item.percent}%;background:${fillColor};"></div>
            </div>
            ${item.reasoning ? `<div style="font-size:10px;color:#6b7280;margin-top:2px;">${escapeHtml(item.reasoning)}</div>` : ""}
          </div>
        `;
      }).join("");
    }
    const flagsEl = document.getElementById("score-flags");
    if (flagsEl) {
      if ((_a = scoreData.flags) == null ? void 0 : _a.length) {
        flagsEl.innerHTML = scoreData.flags.map((flag) => `<span style="display:inline-block;font-size:11px;background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:99px;margin:2px;">${escapeHtml(flag)}</span>`).join("");
      } else {
        flagsEl.innerHTML = '<span class="ga-no-signal">No warning signals found.</span>';
      }
    }
  }
  function displayAlternatives(alternatives, currentProduct) {
    const container = document.getElementById("alternatives-container");
    if (!container) return;
    if (!alternatives || alternatives.length === 0) {
      container.innerHTML = '<p style="font-size:12px;color:#999;padding:8px;">No alternatives found for this category.</p>';
      return;
    }
    container.innerHTML = alternatives.map((product, index) => {
      const altScore = Number(product.score) || 0;
      const altColor = getScoreColor(altScore);
      return `
      <div class="alt-card" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;background:#fff;">
        <div style="font-size:13px;font-weight:600;margin-bottom:4px;">${escapeHtml(product.name || "Alternative product")}</div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:12px;color:#6b7280;">${escapeHtml(product.price || "")}</span>
          <span style="background:${altColor};color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;">
            ${altScore || "?"}/100
          </span>
        </div>

        <div style="margin-bottom:8px;">
          ${(product.tags || []).map((tag) => `
            <span style="display:inline-block;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;padding:1px 6px;border-radius:99px;font-size:10px;margin:2px;">
              ${escapeHtml(tag)}
            </span>
          `).join("")}
        </div>

        <div style="display:flex;gap:6px;">
          <a href="${escapeAttr(product.url || "#")}" target="_blank"
             style="flex:1;text-align:center;padding:6px;background:#16a34a;color:#fff;border-radius:6px;font-size:11px;text-decoration:none;">
            View
          </a>

          <button class="save-alt-btn" data-index="${index}"
                  style="padding:6px 10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;font-size:11px;cursor:pointer;">
            Save
          </button>

          <button class="compare-alt-btn" data-index="${index}"
                  style="padding:6px 10px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;font-size:11px;cursor:pointer;">
            Compare
          </button>
        </div>
      </div>
    `;
    }).join("");
    container.querySelectorAll(".save-alt-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const product = alternatives[Number(btn.dataset.index)];
        await saveThisProduct(product);
      });
    });
    container.querySelectorAll(".compare-alt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = alternatives[Number(btn.dataset.index)];
        compareProducts(currentProduct, product);
      });
    });
  }
  window.saveThisProduct = async function(product) {
    await saveProduct(product);
    await loadPreferencesUI();
    alert("Product saved!");
  };
  window.compareProducts = function(current, alternative) {
    showComparison(current || {}, alternative || {});
  };
  async function loadPreferencesUI() {
    const prefs = await getPreferences();
    document.querySelectorAll(".priority-tag").forEach((btn) => {
      const val = btn.dataset.value;
      setPriorityButtonActive(btn, prefs.priorities.includes(val));
      if (btn.dataset.bound === "true") return;
      btn.dataset.bound = "true";
      btn.addEventListener("click", async () => {
        const current = await getPreferences();
        if (current.priorities.includes(val)) {
          current.priorities = current.priorities.filter((p) => p !== val);
          setPriorityButtonActive(btn, false);
        } else {
          current.priorities.push(val);
          setPriorityButtonActive(btn, true);
        }
        await savePreferences(current);
      });
    });
    const savedList = document.getElementById("saved-products-list");
    if (!savedList) return;
    if (!prefs.savedProducts || prefs.savedProducts.length === 0) {
      savedList.innerHTML = '<p style="font-size:12px;color:#999;">No saved products yet.</p>';
    } else {
      savedList.innerHTML = prefs.savedProducts.map((p) => `
      <div style="font-size:12px;padding:8px;border:1px solid #eee;border-radius:6px;margin-bottom:6px;">
        <strong>${escapeHtml(p.name || "Saved product")}</strong> - Score: ${p.score || "?"}
        <a href="${escapeAttr(p.url || "#")}" target="_blank" style="margin-left:8px;">View</a>
      </div>
    `).join("");
    }
  }
  function showComparison(currentProduct, alternativeProduct) {
    var _a;
    const panel = document.getElementById("comparison-panel");
    if (!panel) {
      const diff2 = alternativeProduct.score - (currentProduct.score || 0);
      alert(`${alternativeProduct.name} scores ${diff2 > 0 ? diff2 + " points higher" : "similarly"}.

Current: ${currentProduct.score || "?"}/100
${alternativeProduct.name}: ${alternativeProduct.score || "?"}/100`);
      return;
    }
    panel.style.display = "block";
    document.getElementById("compare-current-name").textContent = currentProduct.title || currentProduct.name || "Current Product";
    document.getElementById("compare-current-score").textContent = currentProduct.score || "?";
    document.getElementById("compare-current-tags").textContent = (currentProduct.tags || []).join(", ");
    document.getElementById("compare-alt-name").textContent = alternativeProduct.name || "Alternative Product";
    document.getElementById("compare-alt-score").textContent = alternativeProduct.score || "?";
    document.getElementById("compare-alt-tags").textContent = (alternativeProduct.tags || []).join(", ");
    const diff = alternativeProduct.score - (currentProduct.score || 0);
    document.getElementById("compare-verdict").textContent = diff > 0 ? `${alternativeProduct.name} scores ${diff} points higher - a greener choice.` : "Current product is already a strong choice.";
    (_a = document.getElementById("close-compare")) == null ? void 0 : _a.addEventListener("click", () => {
      panel.style.display = "none";
    }, { once: true });
  }
  function setupFeedbackHandlers() {
    var _a;
    let selectedHelpful = null;
    document.querySelectorAll(".feedback-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedHelpful = btn.dataset.helpful === "true";
        document.querySelectorAll(".feedback-btn").forEach((b) => {
          b.style.fontWeight = "normal";
        });
        btn.style.fontWeight = "700";
      });
    });
    (_a = document.getElementById("submit-feedback")) == null ? void 0 : _a.addEventListener("click", async () => {
      var _a2;
      const comment = ((_a2 = document.getElementById("feedback-comment")) == null ? void 0 : _a2.value) || "";
      await fetch("http://localhost:3000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          helpful: selectedHelpful,
          comment,
          site: window.location.hostname
        })
      });
      const thanks = document.getElementById("feedback-thanks");
      const submit = document.getElementById("submit-feedback");
      if (thanks) thanks.style.display = "block";
      if (submit) submit.style.display = "none";
    });
  }
  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function escapeAttr(value) {
    return escapeHtml(value);
  }
  function formatLabel(value) {
    return String(value).replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/^./, (char) => char.toUpperCase());
  }
  function normalizeBreakdownItem(value) {
    if (typeof value === "number") {
      return {
        score: value,
        max: 20,
        percent: Math.max(0, Math.min(100, value * 5)),
        reasoning: ""
      };
    }
    const score = Number(value == null ? void 0 : value.score) || 0;
    const max = Number(value == null ? void 0 : value.max) || 20;
    const percent = max > 0 ? Math.max(0, Math.min(100, Math.round(score / max * 100))) : 0;
    return {
      score,
      max,
      percent,
      reasoning: (value == null ? void 0 : value.reasoning) || ""
    };
  }
  function getScoreColor(score) {
    const value = Number(score) || 0;
    if (value < 30) return "#dc2626";
    if (value < 50) return "#f97316";
    if (value < 70) return "#eab308";
    return "#16a34a";
  }
  function getRatingLabel(score) {
    const value = Number(score) || 0;
    if (value < 30) return "Poor";
    if (value < 50) return "Low";
    if (value < 70) return "Moderate";
    return "Good";
  }
  function setPriorityButtonActive(btn, isActive) {
    btn.classList.toggle("active", isActive);
    btn.style.background = isActive ? "#16a34a" : "#f8fafc";
    btn.style.color = isActive ? "#ffffff" : "#166534";
    btn.style.borderColor = isActive ? "#16a34a" : "#bbf7d0";
    btn.style.fontWeight = isActive ? "700" : "500";
  }
  analyzeProduct();
})();
