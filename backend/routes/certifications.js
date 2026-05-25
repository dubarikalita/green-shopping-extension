const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET /certifications — all certifications
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM certifications ORDER BY name');
    res.json({ certifications: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /certifications/brand — link a certification to a brand
router.post('/brand', async (req, res) => {
  const { brand_id, certification_id, verified, expiry_date, certificate_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO brand_certifications (brand_id, certification_id, verified, expiry_date, certificate_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [brand_id, certification_id, verified || false, expiry_date, certificate_url]
    );
    res.status(201).json({ link: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /certifications/brand/:id — remove a certification from a brand
router.delete('/brand/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM brand_certifications WHERE id = $1', [req.params.id]);
    res.json({ message: 'Certification link removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;