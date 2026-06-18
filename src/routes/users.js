const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM users ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { name, email, skill_level } = req.body;
  if (!name || !email || skill_level == null) {
    return res.status(400).json({ error: 'name, email, and skill_level are required.' });
  }
  try {
    const { rows } = await db.query(
      `INSERT INTO users (name, email, skill_level)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, skill_level]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { name, email, skill_level } = req.body;
  if (!name || !email || skill_level == null) {
    return res.status(400).json({ error: 'name, email, and skill_level are required.' });
  }
  try {
    const { rows } = await db.query(
      `UPDATE users SET name=$1, email=$2, skill_level=$3, updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [name, email, skill_level, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const fields = ['name', 'email', 'skill_level'];
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
      `UPDATE users SET ${updates.join(', ')}, updated_at=NOW()
       WHERE id=$${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM users WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found.' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
