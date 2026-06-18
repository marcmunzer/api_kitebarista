const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT s.*,
              u.name  AS user_name,
              ok.kite_id,
              k.name  AS kite_name, k.size,
              b.name  AS brand_name
       FROM sessions s
       JOIN users       u  ON u.id  = s.user_id
       JOIN owned_kites ok ON ok.id = s.owned_kite_id
       JOIN kites       k  ON k.id  = ok.kite_id
       JOIN brands      b  ON b.id  = ok.brand_id
       ORDER BY s.date DESC, s.start_time DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT s.*,
              u.name  AS user_name,
              ok.kite_id,
              k.name  AS kite_name, k.size,
              b.name  AS brand_name
       FROM sessions s
       JOIN users       u  ON u.id  = s.user_id
       JOIN owned_kites ok ON ok.id = s.owned_kite_id
       JOIN kites       k  ON k.id  = ok.kite_id
       JOIN brands      b  ON b.id  = ok.brand_id
       WHERE s.id=$1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Session not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { date, start_time, end_time, user_id, owned_kite_id } = req.body;
  if (!date || !user_id || !owned_kite_id) {
    return res.status(400).json({ error: 'date, user_id, and owned_kite_id are required.' });
  }
  try {
    const { rows } = await db.query(
      `INSERT INTO sessions (date, start_time, end_time, user_id, owned_kite_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [date, start_time || null, end_time || null, user_id, owned_kite_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { date, start_time, end_time, user_id, owned_kite_id } = req.body;
  if (!date || !user_id || !owned_kite_id) {
    return res.status(400).json({ error: 'date, user_id, and owned_kite_id are required.' });
  }
  try {
    const { rows } = await db.query(
      `UPDATE sessions
       SET date=$1, start_time=$2, end_time=$3, user_id=$4, owned_kite_id=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [date, start_time || null, end_time || null, user_id, owned_kite_id, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Session not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const fields = ['date', 'start_time', 'end_time', 'user_id', 'owned_kite_id'];
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
      `UPDATE sessions SET ${updates.join(', ')}, updated_at=NOW()
       WHERE id=$${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Session not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM sessions WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Session not found.' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
