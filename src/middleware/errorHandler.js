function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === '23505') {
    return res.status(409).json({ error: 'A record with that value already exists.' });
  }
  if (err.code === '23503') {
    return res.status(409).json({ error: 'Referenced record does not exist.' });
  }
  if (err.code === '23514') {
    return res.status(400).json({ error: 'Value violates a check constraint.' });
  }

  res.status(500).json({ error: 'Internal server error.' });
}

module.exports = errorHandler;
