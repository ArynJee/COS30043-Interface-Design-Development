export const up = (pgm) => {
  // Extend cart_items to support regular product items
  pgm.sql(`
    ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS product_id INTEGER REFERENCES products(id) ON DELETE CASCADE;
    ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS item_name VARCHAR(255);
  `);

  // Make furniture_type nullable so product items can skip it
  pgm.sql(`
    DO $$ BEGIN
      ALTER TABLE cart_items ALTER COLUMN furniture_type DROP NOT NULL;
    EXCEPTION WHEN others THEN null;
    END $$;
  `);

  pgm.sql(`
    CREATE TABLE IF NOT EXISTS orders (
      id                        SERIAL PRIMARY KEY,
      user_id                   INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status                    VARCHAR(50)     DEFAULT 'paid',
      subtotal                  NUMERIC(10,2)   NOT NULL,
      total_amount              NUMERIC(10,2)   NOT NULL,
      shipping_name             VARCHAR(255),
      shipping_address          TEXT,
      shipping_city             VARCHAR(100),
      shipping_state            VARCHAR(100),
      shipping_zip              VARCHAR(20),
      stripe_payment_intent_id  VARCHAR(255),
      created_at                TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
      updated_at                TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
    );
  `);

  pgm.sql(`
    CREATE TABLE IF NOT EXISTS order_items (
      id             SERIAL PRIMARY KEY,
      order_id       INTEGER         REFERENCES orders(id) ON DELETE CASCADE,
      item_type      VARCHAR(20)     DEFAULT 'product',
      product_id     INTEGER         REFERENCES products(id) ON DELETE SET NULL,
      item_name      VARCHAR(255)    NOT NULL,
      unit_price     NUMERIC(10,2)   NOT NULL,
      quantity       INTEGER         DEFAULT 1,
      configuration  JSONB           DEFAULT '{}',
      preview_image  TEXT,
      created_at     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    ALTER TABLE cart_items DROP COLUMN IF EXISTS item_name;
    ALTER TABLE cart_items DROP COLUMN IF EXISTS product_id;
  `);
};
