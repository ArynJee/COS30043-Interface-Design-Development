export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id             SERIAL PRIMARY KEY,
      user_id        INTEGER REFERENCES users(id) ON DELETE CASCADE,
      is_custom      BOOLEAN DEFAULT TRUE,
      furniture_type VARCHAR(100) NOT NULL,
      skeleton_type  VARCHAR(50),
      configuration  JSONB DEFAULT '{}',
      quantity       INTEGER DEFAULT 1,
      unit_price     NUMERIC(10,2) NOT NULL,
      preview_image  TEXT,
      created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS cart_items;`);
};
