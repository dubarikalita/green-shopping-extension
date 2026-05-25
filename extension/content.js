const { detectCategory } = require('./categoryDetector.js');
const { fetchScore, fetchAlternatives } = require('./api.js');
const { getPreferences, savePreferences, saveProduct } = require('./storage.js');
const { extractProductData } = require('./sites/index.js');

async function analyzeProduct() {
  const product = extractProductData();

  if (!product || !product.title) {
    console.log('Green Shopping: No product found on this page.');
    return;
  }

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

    const sourceBadge = document.getElementById('score-source');
    if (sourceBadge) {
      sourceBadge.textContent = scoreData.source === 'ai' ? 'AI Analysis' : 'Keyword Match';
    }

    if (scoreData.summary) {
      const summaryEl = document.getElementById('ai-summary');
      if (summaryEl) summaryEl.textContent = scoreData.summary;
    }

    if (scoreData.improvements?.length) {
      const impEl = document.getElementById('ai-improvements');
      if (impEl) {
        impEl.innerHTML = scoreData.improvements
          .map(i => `<li>${escapeHtml(i)}</li>`)
          .join('');
      }
    }
  } catch (err) {
    console.error('Green Shopping: Analysis failed:', err);
  }
}

function displayScore(scoreData, prefs) {
  const scoreEl = document.getElementById('eco-score');
  if (scoreEl) scoreEl.textContent = scoreData.score || '?';

  const ratingEl = document.getElementById('eco-rating');
  if (ratingEl) ratingEl.textContent = scoreData.rating || 'Analyzed';

  const breakdownEl = document.getElementById('score-breakdown');
  if (breakdownEl && scoreData.breakdown) {
    breakdownEl.innerHTML = Object.entries(scoreData.breakdown)
      .map(([key, value]) => `
        <div style="font-size:12px;margin-bottom:6px;">
          <div style="display:flex;justify-content:space-between;">
            <span>${escapeHtml(formatLabel(key))}</span>
            <span>${value}/20</span>
          </div>
          <div style="height:6px;background:#e5e7eb;border-radius:99px;overflow:hidden;">
            <div style="height:100%;width:${Math.min(value * 5, 100)}%;background:#16a34a;"></div>
          </div>
        </div>
      `)
      .join('');
  }

  const flagsEl = document.getElementById('score-flags');
  if (flagsEl && scoreData.flags?.length) {
    flagsEl.innerHTML = scoreData.flags
      .map(flag => `<span style="display:inline-block;font-size:11px;background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:99px;margin:2px;">${escapeHtml(flag)}</span>`)
      .join('');
  }
}

function displayAlternatives(alternatives, currentProduct) {
  const container = document.getElementById('alternatives-container');
  if (!container) return;

  if (!alternatives || alternatives.length === 0) {
    container.innerHTML = '<p style="font-size:12px;color:#999;padding:8px;">No alternatives found for this category.</p>';
    return;
  }

  container.innerHTML = alternatives.map((product, index) => `
    <div class="alt-card" style="padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;background:#fff;">
      <div style="font-size:13px;font-weight:600;margin-bottom:4px;">${escapeHtml(product.name || 'Alternative product')}</div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <span style="font-size:12px;color:#6b7280;">${escapeHtml(product.price || '')}</span>
        <span style="background:#dcfce7;color:#15803d;font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;">
          ${product.score || '?'}/100
        </span>
      </div>

      <div style="margin-bottom:8px;">
        ${(product.tags || []).map(tag => `
          <span style="display:inline-block;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;padding:1px 6px;border-radius:99px;font-size:10px;margin:2px;">
            ${escapeHtml(tag)}
          </span>
        `).join('')}
      </div>

      <div style="display:flex;gap:6px;">
        <a href="${escapeAttr(product.url || '#')}" target="_blank"
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
  `).join('');

  container.querySelectorAll('.save-alt-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const product = alternatives[Number(btn.dataset.index)];
      await saveThisProduct(product);
    });
  });

  container.querySelectorAll('.compare-alt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = alternatives[Number(btn.dataset.index)];
      compareProducts(currentProduct, product);
    });
  });
}

window.saveThisProduct = async function(product) {
  await saveProduct(product);
  alert('Product saved!');
};

window.compareProducts = function(current, alternative) {
  showComparison(current || {}, alternative || {});
};

async function loadPreferencesUI() {
  const prefs = await getPreferences();

  document.querySelectorAll('.priority-tag').forEach(btn => {
    const val = btn.dataset.value;
    if (prefs.priorities.includes(val)) btn.classList.add('active');

    btn.addEventListener('click', async () => {
      const current = await getPreferences();

      if (current.priorities.includes(val)) {
        current.priorities = current.priorities.filter(p => p !== val);
        btn.classList.remove('active');
      } else {
        current.priorities.push(val);
        btn.classList.add('active');
      }

      await savePreferences(current);
    });
  });

  const savedList = document.getElementById('saved-products-list');
  if (!savedList) return;

  if (!prefs.savedProducts || prefs.savedProducts.length === 0) {
    savedList.innerHTML = '<p style="font-size:12px;color:#999;">No saved products yet.</p>';
  } else {
    savedList.innerHTML = prefs.savedProducts.map(p => `
      <div style="font-size:12px;padding:8px;border:1px solid #eee;border-radius:6px;margin-bottom:6px;">
        <strong>${escapeHtml(p.name || 'Saved product')}</strong> - Score: ${p.score || '?'}
        <a href="${escapeAttr(p.url || '#')}" target="_blank" style="margin-left:8px;">View</a>
      </div>
    `).join('');
  }
}

function showComparison(currentProduct, alternativeProduct) {
  const panel = document.getElementById('comparison-panel');

  if (!panel) {
    const diff = alternativeProduct.score - (currentProduct.score || 0);
    alert(`${alternativeProduct.name} scores ${diff > 0 ? diff + ' points higher' : 'similarly'}.\n\nCurrent: ${currentProduct.score || '?'}/100\n${alternativeProduct.name}: ${alternativeProduct.score || '?'}/100`);
    return;
  }

  panel.style.display = 'block';

  document.getElementById('compare-current-name').textContent = currentProduct.title || currentProduct.name || 'Current Product';
  document.getElementById('compare-current-score').textContent = currentProduct.score || '?';
  document.getElementById('compare-current-tags').textContent = (currentProduct.tags || []).join(', ');

  document.getElementById('compare-alt-name').textContent = alternativeProduct.name || 'Alternative Product';
  document.getElementById('compare-alt-score').textContent = alternativeProduct.score || '?';
  document.getElementById('compare-alt-tags').textContent = (alternativeProduct.tags || []).join(', ');

  const diff = alternativeProduct.score - (currentProduct.score || 0);
  document.getElementById('compare-verdict').textContent =
    diff > 0
      ? `${alternativeProduct.name} scores ${diff} points higher - a greener choice.`
      : 'Current product is already a strong choice.';

  document.getElementById('close-compare')?.addEventListener('click', () => {
    panel.style.display = 'none';
  });
}

let selectedHelpful = null;

document.querySelectorAll('.feedback-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedHelpful = btn.dataset.helpful === 'true';
    document.querySelectorAll('.feedback-btn').forEach(b => {
      b.style.fontWeight = 'normal';
    });
    btn.style.fontWeight = '700';
  });
});

document.getElementById('submit-feedback')?.addEventListener('click', async () => {
  const comment = document.getElementById('feedback-comment')?.value || '';

  await fetch('http://localhost:3000/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      helpful: selectedHelpful,
      comment,
      site: window.location.hostname
    })
  });

  const thanks = document.getElementById('feedback-thanks');
  const submit = document.getElementById('submit-feedback');

  if (thanks) thanks.style.display = 'block';
  if (submit) submit.style.display = 'none';
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function formatLabel(value) {
  return String(value)
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, char => char.toUpperCase());
}

analyzeProduct();
loadPreferencesUI();