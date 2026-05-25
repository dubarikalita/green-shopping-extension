const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /alternatives?category=water-bottle
router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    const query = category
      ? 'SELECT * FROM products WHERE category = $1 ORDER BY score DESC'
      : 'SELECT * FROM products ORDER BY score DESC';

    const values = category ? [category] : [];
    const result = await pool.query(query, values);

    res.json({ alternatives: result.rows });
  } catch (err) {
    console.error('DB error in /alternatives:', err.message);

    // Fallback to hardcoded data if DB isn't connected yet
    const fallback = [
      { id: 1, name: "Hydro Flask Standard Mouth", brand: "Hydro Flask", score: 78, tags: ["BPA-free","Recyclable","Durable"], price: "$35", url: "https://www.amazon.com/dp/B097HFCQT3", category: "water-bottle" },
      { id: 2, name: "Klean Kanteen Classic", brand: "Klean Kanteen", score: 85, tags: ["B Corp","Recycled Steel","Carbon Neutral"], price: "$28", url: "https://www.amazon.com/dp/B000FGDKJU", category: "water-bottle" },
      { id: 3, name: "S'well Stainless Steel Bottle", brand: "S'well", score: 72, tags: ["BPA-free","Reusable","Plastic-free packaging"], price: "$32", url: "https://www.amazon.com/dp/B00JMGFGAA", category: "water-bottle" }
    ];

    const filtered = category ? fallback.filter(p => p.category === category) : fallback;
    res.json({ alternatives: filtered });
  }
});

module.exports = router;