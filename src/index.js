require('dotenv').config();
const express = require('express');
const cors = require('cors');

const migrate = require('./db/migrate');
const usersRouter = require('./routes/users');
const brandsRouter = require('./routes/brands');
const kitesRouter = require('./routes/kites');
const ownedKitesRouter = require('./routes/ownedKites');
const sessionsRouter = require('./routes/sessions');
const locationsRouter = require('./routes/locations');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/users', usersRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/kites', kitesRouter);
app.use('/api/owned-kites', ownedKitesRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/locations', locationsRouter);

app.use(errorHandler);

migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`KiteBarista API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Migration failed, server not started:', err.message);
    process.exit(1);
  });
