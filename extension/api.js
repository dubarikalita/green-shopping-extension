const API_BASE = 'http://localhost:3000';

async function fetchScore(title, description, brand, category = 'water-bottle') {
  try {
    const params = new URLSearchParams({ title, description, brand, category });
    const res = await fetch(`${API_BASE}/score?${params}`);
    if (!res.ok) throw new Error('Score fetch failed');
    return res.json();
  } catch (err) {
    console.error('fetchScore error:', err);
    return { score: 0, breakdown: {}, greenwashingDetected: false, source: 'error' };
  }
}

async function fetchAlternatives(category) {
  try {
    const params = new URLSearchParams({ category });
    const res = await fetch(`${API_BASE}/alternatives?${params}`);
    if (!res.ok) throw new Error('Alternatives fetch failed');
    return res.json();
  } catch (err) {
    console.error('fetchAlternatives error:', err);
    return { alternatives: [] };
  }
}

module.exports = { fetchScore, fetchAlternatives };