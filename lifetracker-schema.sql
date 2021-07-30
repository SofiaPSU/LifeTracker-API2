CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  password      TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  username      TEXT NOT NULL,
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()   
);

CREATE TABLE sleep (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date          DATE ,
  start_time    TIMESTAMP NOT NULL,
  end_time      TIMESTAMP NOT NULL
);

CREATE TABLE exercise(
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  timestamp     TIMESTAMP DEFAULT NOW(),
  duration      INTEGER,
  intensity     INTEGER,
  category      TEXT
);
CREATE TABLE nutrition(
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
  timestamp     TIMESTAMP DEFAULT NOW(),
  quantity      INTEGER DEFAULT 1,
  calories     INTEGER,
  category      TEXT,
  image_url     TEXT,
  date          DATE DEFAULT NOW(),
  time          TIME DEFAULT NOW()
);