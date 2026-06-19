const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM locations ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM locations WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Location not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { name, country, waves, flatWater } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required.' });
  if (!country) return res.status(400).json({ error: 'country is required.' });
  try {
    const { rows } = await db.query(
      `INSERT INTO locations (name, country, waves, flat_water) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, country, waves ?? false, flatWater ?? false]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { name, country, waves, flatWater } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required.' });
  if (!country) return res.status(400).json({ error: 'country is required.' });
  try {
    const { rows } = await db.query(
      `UPDATE locations SET name=$1, country=$2, waves=$3, flat_water=$4, updated_at=NOW() WHERE id=$5 RETURNING *`,
      [name, country, waves ?? false, flatWater ?? false, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Location not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const fieldMap = { name: 'name', country: 'country', waves: 'waves', flatWater: 'flat_water' };
  const updates = [];
  const values = [];
  Object.entries(fieldMap).forEach(([bodyKey, col]) => {
    if (req.body[bodyKey] !== undefined) {
      values.push(req.body[bodyKey]);
      updates.push(`${col}=$${values.length}`);
    }
  });
  if (!updates.length) return res.status(400).json({ error: 'No updatable fields provided.' });
  values.push(req.params.id);
  try {
    const { rows } = await db.query(
      `UPDATE locations SET ${updates.join(', ')}, updated_at=NOW() WHERE id=$${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Location not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM locations WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Location not found.' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
