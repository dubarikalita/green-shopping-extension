const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// POST /compare  body: { productA: {...}, productB_id: 2 }
router.post('/', async (req, res) => {
  const { productA, productB_id } = req.body;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [productB_id]);
    const productB = result.rows[0];
    if (!productB) return res.status(404).json({ error: 'Product not found' });

    res.json({
      comparison: {
        current:     productA,
        alternative: productB,
        scoreDiff:   productB.score - (productA.score || 0),
        winner:      productB.score > (productA.score || 0) ? 'alternative' : 'current'
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;