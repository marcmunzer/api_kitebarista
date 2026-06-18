const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM brands ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM brands WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Brand not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { name, webpage } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required.' });
  try {
    const { rows } = await db.query(
      `INSERT INTO brands (name, webpage) VALUES ($1, $2) RETURNING *`,
      [name, webpage || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { name, webpage } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required.' });
  try {
    const { rows } = await db.query(
      `UPDATE brands SET name=$1, webpage=$2, updated_at=NOW() WHERE id=$3 RETURNING *`,
      [name, webpage || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Brand not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const fields = ['name', 'webpage'];
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
      `UPDATE brands SET ${updates.join(', ')}, updated_at=NOW() WHERE id=$${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Brand not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM brands WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Brand not found.' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
