const express = require('express');
const router = express.Router();
const { getAIScore } = require('../services/aiScorer');
const CATEGORY_RULES = require('../categories');

// Keyword fallback scorer (used if AI fails)
function keywordScore(productData) {
  const { title = '', description = '', brand = '', category = 'water-bottle' } = productData;
  const text  = `${title} ${description} ${brand}`.toLowerCase();
  const rules = CATEGORY_RULES[category] || CATEGORY_RULES['water-bottle'];
  const weights = { materials: 30, certifications: 25, packaging: 20, brand: 15, durability: 10 };

  let totalScore = 0;
  const breakdown = {};

  for (const [cat, keywords] of Object.entries(rules.keywords)) {
    const weight  = weights[cat] || 10;
    const matched = keywords.filter(kw => text.includes(kw));
    const score   = Math.min((matched.length / keywords.length) * weight * 3, weight);
    breakdown[cat] = { score: Math.round(score), max: weight, matched };
    totalScore += score;
  }

  const vague = ['eco-friendly','green','natural','sustainable','earth-friendly'];
  const flags = vague.filter(v => text.includes(v));
  const hasCert = breakdown.certifications?.matched?.length > 0;

  return {
    score: Math.round(totalScore),
    breakdown,
    greenwashingDetected: flags.length > 0 && !hasCert,
    greenwashingFlags: flags.length > 0 && !hasCert ? flags : [],
    source: 'keyword'
  };
}

// GET /score?title=...&description=...&brand=...&category=...
router.get('/', async (req, res) => {
  const { title = '', description = '', brand = '', category = 'water-bottle' } = req.query;

  try {
    // Try AI scoring first
    const aiResult = await getAIScore({ title, description, brand, category });
    res.json({ ...aiResult, source: 'ai' });
  } catch (err) {
    console.error('AI scoring failed, falling back to keyword scoring:', err.message);
    // Fall back to keyword scoring if AI fails
    const fallback = keywordScore({ title, description, brand, category });
    res.json(fallback);
  }
});

module.exports = router;