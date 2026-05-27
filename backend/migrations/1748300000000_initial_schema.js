export const up = (pgm) => {
  pgm.sql(`
    DO $$ BEGIN
      CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  pgm.sql(`
    CREATE TABLE IF NOT EXISTS users (
      id             SERIAL PRIMARY KEY,
      first_name     VARCHAR(100)  NOT NULL,
      last_name      VARCHAR(100)  NOT NULL,
      email          VARCHAR(100)  UNIQUE NOT NULL,
      phone_number   VARCHAR(20),
      address        TEXT,
      password_hash  TEXT          NOT NULL,
      created_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      updated_at     TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otp_requests (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER   REFERENCES users(id),
      email       VARCHAR(100) NOT NULL,
      otp_code    VARCHAR(10)  NOT NULL,
      expires_at  TIMESTAMP    NOT NULL,
      is_used     BOOLEAN      DEFAULT FALSE,
      created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id    SERIAL PRIMARY KEY,
      name  VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_tags (
      id           SERIAL PRIMARY KEY,
      category_id  INTEGER REFERENCES categories(id),
      name         VARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id           SERIAL PRIMARY KEY,
      name         VARCHAR(255)    NOT NULL,
      description  TEXT,
      category_id  INTEGER         REFERENCES categories(id),
      tag_id       INTEGER         REFERENCES product_tags(id),
      base_price   NUMERIC(10,2)   NOT NULL,
      sold_count   INTEGER         DEFAULT 0,
      stock_count  INTEGER         DEFAULT 1000,
      width_cm     NUMERIC(8,2),
      height_cm    NUMERIC(8,2),
      depth_cm     NUMERIC(8,2),
      featured     BOOLEAN         DEFAULT FALSE,
      created_at   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id             SERIAL PRIMARY KEY,
      product_id     INTEGER REFERENCES products(id) ON DELETE CASCADE,
      image_url      TEXT    NOT NULL,
      display_order  INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER REFERENCES users(id),
      rating      INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment     TEXT,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS feedback;
    DROP TABLE IF EXISTS product_images;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS product_tags;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS otp_requests;
    DROP TABLE IF EXISTS users;
    DROP TYPE  IF EXISTS payment_status_enum;
  `);
};
