const express = require('express');
const router = express.Router();
const db = require('../db');

const SELECT = `
  SELECT f.*, l.name AS location_name
  FROM forecasts f
  LEFT JOIN locations l ON l.id = f.location_id`;

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(`${SELECT} ORDER BY f.time DESC`);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query(`${SELECT} WHERE f.id=$1`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Forecast not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { time, location_id, windSpeed, windDirection, waveHeight, waveDirection, tide, temperature } = req.body;
  if (!time) return res.status(400).json({ error: 'time is required.' });
  try {
    const { rows } = await db.query(
      `INSERT INTO forecasts
         (time, location_id, wind_speed, wind_direction, wave_height, wave_direction, tide, temperature)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [time, location_id ?? null, windSpeed ?? null, windDirection ?? null,
       waveHeight ?? null, waveDirection ?? null, tide ?? null, temperature ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { time, location_id, windSpeed, windDirection, waveHeight, waveDirection, tide, temperature } = req.body;
  if (!time) return res.status(400).json({ error: 'time is required.' });
  try {
    const { rows } = await db.query(
      `UPDATE forecasts
       SET time=$1, location_id=$2, wind_speed=$3, wind_direction=$4,
           wave_height=$5, wave_direction=$6, tide=$7, temperature=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [time, location_id ?? null, windSpeed ?? null, windDirection ?? null,
       waveHeight ?? null, waveDirection ?? null, tide ?? null, temperature ?? null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Forecast not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const fieldMap = {
    time: 'time',
    location_id: 'location_id',
    windSpeed: 'wind_speed',
    windDirection: 'wind_direction',
    waveHeight: 'wave_height',
    waveDirection: 'wave_direction',
    tide: 'tide',
    temperature: 'temperature',
  };
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
      `UPDATE forecasts SET ${updates.join(', ')}, updated_at=NOW() WHERE id=$${values.length} RETURNING *`,
      values
    );
    if (!rows.length) return res.status(404).json({ error: 'Forecast not found.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM forecasts WHERE id=$1 RETURNING id', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Forecast not found.' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
