const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT k.*, b.name AS brand_name
       FROM kites k
       JOIN brands b ON b.id = k.brand_id
       ORDER BY k.id`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT k.*, b.name AS brand_name
       FROM kites k
       JOIN brands b ON b.id = k.brand_id
       WHERE k.id=$1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Kite model not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { brand_id, name, year, size } = req.body;
  if (!brand_id || !name) return res.status(400).json({ error: 'brand_id and name are required.' });
  try {
    const { rows } = await db.query(
      `INSERT INTO kites (brand_id, name, year, size)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [brand_id, name, year || null, size || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { brand_id, name, year, size } = req.body;
  if (!brand_id || !name) return res.status(400).json({ error: 'brand_id and name are required.' });
  try {
    const { rows } = await db.query(
      `UPDATE kites SET brand_id=$1, name=$2, year=$3, size=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [brand_id, name, year || null, size || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Kite model not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const fields = ['brand_id', 'name', 'year', 'size'];
  const updates = [];
  const values = [];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) {
      values.push(req.body[f]);
      updates.push(`${f}=$${values.length}`);
    }
  });
  if (!updates.length) return res.status(400).json({ error: 'No updatable fields provided.' });
  values.push(req.params.id);
  try {
    const { rows } = await db.query(
      `UPDATE kites SET ${updates.join(', ')}, updated_at=NOW()
       WHERE id=$${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Kite model not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM kites WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Kite model not found.' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
