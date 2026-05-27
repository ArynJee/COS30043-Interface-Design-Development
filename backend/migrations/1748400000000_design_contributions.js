export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS design_contributions (
      id                SERIAL PRIMARY KEY,
      user_id           INTEGER REFERENCES users(id) ON DELETE SET NULL,
      area              VARCHAR(100) NOT NULL,
      furniture_type    VARCHAR(100) NOT NULL,
      description       TEXT,
      preview_image_url TEXT,
      configuration     JSONB DEFAULT '{}',
      total_cost        NUMERIC(10,2) DEFAULT 0,
      created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS design_contributions;`);
};
