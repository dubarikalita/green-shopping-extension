const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// POST /feedback — submit feedback on a product score
router.post('/', async (req, res) => {
  const { product_id, rating, comment, helpful, site } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO feedback (product_id, rating, comment, helpful, site)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [product_id, rating, comment, helpful, site]
    );
    res.status(201).json({ feedback: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /feedback — get all feedback (admin use)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.*, p.name AS product_name
      FROM feedback f
      LEFT JOIN products p ON f.product_id = p.id
      ORDER BY f.created_at DESC
    `);
    res.json({ feedback: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;