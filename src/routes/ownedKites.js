const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT ok.*,
              u.name  AS user_name,
              b.name  AS brand_name,
              k.name  AS kite_name, k.year, k.size
       FROM owned_kites ok
       JOIN users  u ON u.id = ok.user_id
       JOIN brands b ON b.id = ok.brand_id
       JOIN kites  k ON k.id = ok.kite_id
       ORDER BY ok.id`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT ok.*,
              u.name  AS user_name,
              b.name  AS brand_name,
              k.name  AS kite_name, k.year, k.size
       FROM owned_kites ok
       JOIN users  u ON u.id = ok.user_id
       JOIN brands b ON b.id = ok.brand_id
       JOIN kites  k ON k.id = ok.kite_id
       WHERE ok.id=$1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Owned kite not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { user_id, brand_id, kite_id, purchased_date, sold_date } = req.body;
  if (!user_id || !brand_id || !kite_id) {
    return res.status(400).json({ error: 'user_id, brand_id, and kite_id are required.' });
  }
  try {
    const { rows } = await db.query(
      `INSERT INTO owned_kites (user_id, brand_id, kite_id, purchased_date, sold_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, brand_id, kite_id, purchased_date || null, sold_date || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { user_id, brand_id, kite_id, purchased_date, sold_date } = req.body;
  if (!user_id || !brand_id || !kite_id) {
    return res.status(400).json({ error: 'user_id, brand_id, and kite_id are required.' });
  }
  try {
    const { rows } = await db.query(
      `UPDATE owned_kites
       SET user_id=$1, brand_id=$2, kite_id=$3, purchased_date=$4, sold_date=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [user_id, brand_id, kite_id, purchased_date || null, sold_date || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Owned kite not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const fields = ['user_id', 'brand_id', 'kite_id', 'purchased_date', 'sold_date'];
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
      `UPDATE owned_kites SET ${updates.join(', ')}, updated_at=NOW()
       WHERE id=$${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Owned kite not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM owned_kites WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Owned kite not found.' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
