CREATE TABLE IF NOT EXISTS users (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  email     VARCHAR(255) NOT NULL UNIQUE,
  skill_level INTEGER NOT NULL CHECK (skill_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brands (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(255) NOT NULL UNIQUE,
  webpage   VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kites (
  id        SERIAL PRIMARY KEY,
  brand_id  INTEGER NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  name      VARCHAR(255) NOT NULL,
  year      INTEGER,
  size      NUMERIC(5, 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS owned_kites (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id       INTEGER NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  kite_id        INTEGER NOT NULL REFERENCES kites(id) ON DELETE RESTRICT,
  purchased_date DATE,
  sold_date      DATE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id             SERIAL PRIMARY KEY,
  date           DATE NOT NULL,
  start_time     TIME,
  end_time       TIME,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owned_kite_id  INTEGER NOT NULL REFERENCES owned_kites(id) ON DELETE RESTRICT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
