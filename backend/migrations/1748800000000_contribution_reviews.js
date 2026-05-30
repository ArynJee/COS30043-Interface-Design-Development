export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS contribution_reviews (
      id                SERIAL PRIMARY KEY,
      contribution_id   INTEGER REFERENCES design_contributions(id) ON DELETE CASCADE,
      user_id           INTEGER REFERENCES users(id),
      rating            INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment           TEXT,
      created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS contribution_reviews;`);
};
