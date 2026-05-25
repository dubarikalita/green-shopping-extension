const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET /brands — get all brands
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, 
        ARRAY_AGG(c.short_name) FILTER (WHERE c.short_name IS NOT NULL) AS certifications
      FROM brands b
      LEFT JOIN brand_certifications bc ON b.id = bc.brand_id
      LEFT JOIN certifications c ON bc.certification_id = c.id
      GROUP BY b.id
      ORDER BY b.sustainability_rating DESC
    `);
    res.json({ brands: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /brands/:id — get single brand with full details
router.get('/:id', async (req, res) => {
  try {
    const brand = await pool.query('SELECT * FROM brands WHERE id = $1', [req.params.id]);
    if (!brand.rows.length) return res.status(404).json({ error: 'Brand not found' });

    const certs = await pool.query(`
      SELECT c.*, bc.verified, bc.expiry_date
      FROM certifications c
      JOIN brand_certifications bc ON c.id = bc.certification_id
      WHERE bc.brand_id = $1
    `, [req.params.id]);

    const products = await pool.query(
      'SELECT * FROM products WHERE brand_id = $1 ORDER BY score DESC',
      [req.params.id]
    );

    res.json({
      brand: brand.rows[0],
      certifications: certs.rows,
      products: products.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /brands — create a new brand
router.post('/', async (req, res) => {
  const { name, sustainability_rating, carbon_neutral, website, description, country } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO brands (name, sustainability_rating, carbon_neutral, website, description, country)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, sustainability_rating || 0, carbon_neutral || false, website, description, country]
    );
    res.status(201).json({ brand: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /brands/:id — update a brand
router.put('/:id', async (req, res) => {
  const { name, sustainability_rating, carbon_neutral, website, description, country, verified } = req.body;
  try {
    const result = await pool.query(
      `UPDATE brands SET
        name = COALESCE($1, name),
        sustainability_rating = COALESCE($2, sustainability_rating),
        carbon_neutral = COALESCE($3, carbon_neutral),
        website = COALESCE($4, website),
        description = COALESCE($5, description),
        country = COALESCE($6, country),
        verified = COALESCE($7, verified),
        updated_at = NOW()
       WHERE id = $8 RETURNING *`,
      [name, sustainability_rating, carbon_neutral, website, description, country, verified, req.params.id]
    );
    res.json({ brand: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /brands/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM brands WHERE id = $1', [req.params.id]);
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;