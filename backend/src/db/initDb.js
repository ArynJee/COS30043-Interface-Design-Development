import db from "./db.js";

const initDb = async () => {
  try {
    // enums
    await db.query(`
        DO $$ BEGIN
            CREATE TYPE payment_status_enum AS ENUM (
                'pending',
                'paid'
            );
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
    `);

    // tables
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone_number VARCHAR(20),
            address TEXT,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS otp_requests(
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            email VARCHAR(100) NOT NULL,
            otp_code VARCHAR(10) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            is_used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS categories(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS product_tags(
            id SERIAL PRIMARY KEY,
            category_id INTEGER REFERENCES categories(id),
            name VARCHAR(100) UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            category_id INTEGER REFERENCES categories(id),
            tag_id INTEGER REFERENCES product_tags(id),
            base_price NUMERIC(10,2) NOT NULL,
            sold_count INTEGER DEFAULT 0,
            width_cm NUMERIC(8,2),
            height_cm NUMERIC(8,2),
            depth_cm NUMERIC(8,2),
            featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS product_images (
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
            image_url TEXT NOT NULL,
            display_order INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS feedback (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS design_contributions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            area VARCHAR(100),
            furniture_type VARCHAR(100),
            description TEXT,
            preview_image_url TEXT,
            configuration JSONB,
            total_cost NUMERIC(10,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS contribution_reviews (
            id SERIAL PRIMARY KEY,
            contribution_id INTEGER REFERENCES design_contributions(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id),
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cart_items (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            is_custom BOOLEAN DEFAULT TRUE,
            furniture_type VARCHAR(100),
            skeleton_type VARCHAR(100),
            configuration JSONB,
            quantity INTEGER DEFAULT 1,
            unit_price NUMERIC(10,2) NOT NULL,
            preview_image TEXT,
            product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
            item_name VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // add stock_count if it doesn't exist yet (safe for existing DBs)
    await db.query(`
      ALTER TABLE products
        ADD COLUMN IF NOT EXISTS stock_count INTEGER DEFAULT 1000;
    `);

    console.log("Database initialized");

  } catch (err) {
    console.error(err);
  }
};

initDb();