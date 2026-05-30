export const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_method VARCHAR(10);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_fee    NUMERIC(10,2);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount      NUMERIC(10,2);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    ALTER TABLE orders DROP COLUMN IF EXISTS shipping_method;
    ALTER TABLE orders DROP COLUMN IF EXISTS shipping_fee;
    ALTER TABLE orders DROP COLUMN IF EXISTS tax_amount;
  `);
};
