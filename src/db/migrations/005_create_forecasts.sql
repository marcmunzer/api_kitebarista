CREATE TABLE forecasts (
  id              SERIAL PRIMARY KEY,
  time            TIMESTAMP NOT NULL,
  location_id     INTEGER REFERENCES locations(id) ON DELETE SET NULL,
  wind_speed      NUMERIC,
  wind_direction  INTEGER,
  wave_height     NUMERIC,
  wave_direction  INTEGER,
  tide            NUMERIC,
  temperature     NUMERIC,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
