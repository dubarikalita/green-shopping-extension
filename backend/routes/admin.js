const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET /admin/stats — dashboard summary stats
router.get('/stats', async (req, res) => {
  try {
    const [products, brands, feedback, topBrands] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM products'),
      pool.query('SELECT COUNT(*) FROM brands'),
      pool.query('SELECT COUNT(*) FROM feedback'),
      pool.query('SELECT name, sustainability_rating FROM brands ORDER BY sustainability_rating DESC LIMIT 5')
    ]);

    res.json({
      totalProducts:  parseInt(products.rows[0].count),
      totalBrands:    parseInt(brands.rows[0].count),
      totalFeedback:  parseInt(feedback.rows[0].count),
      topBrands:      topBrands.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /admin/products — all products with brand name
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, b.name AS brand_name
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.id
      ORDER BY p.created_at DESC
    `);
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /admin/products — add a new product
router.post('/products', async (req, res) => {
  const { name, brand_id, category, score, tags, price, url, image_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (name, brand_id, category, score, tags, price, url, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, brand_id, category, score, tags, price, url, image_url]
    );
    res.status(201).json({ product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /admin/products/:id — update a product
router.put('/products/:id', async (req, res) => {
  const { name, score, tags, price, url, category } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET
        name     = COALESCE($1, name),
        score    = COALESCE($2, score),
        tags     = COALESCE($3, tags),
        price    = COALESCE($4, price),
        url      = COALESCE($5, url),
        category = COALESCE($6, category)
       WHERE id = $7 RETURNING *`,
      [name, score, tags, price, url, category, req.params.id]
    );
    res.json({ product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /admin/products/:id
router.delete('/admin/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;