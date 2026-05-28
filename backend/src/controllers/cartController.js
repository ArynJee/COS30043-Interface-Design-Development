import db from "../db/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function saveBase64Image(base64Data) {
  if (!base64Data) return null;
  const data = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const filename = `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}.png`;
  const filepath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filepath, Buffer.from(data, "base64"));
  return `/uploads/${filename}`;
}

// GET /api/cart  — user's cart items
export const getCartItems = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, furniture_type, skeleton_type, configuration, quantity, unit_price, preview_image, created_at
       FROM cart_items WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );
    res.json({ items: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// POST /api/cart  — add custom item
export const addCartItem = async (req, res) => {
  try {
    const { furniture_type, skeleton_type, configuration, unit_price, preview_image } = req.body;
    if (!furniture_type || unit_price == null) {
      return res.status(400).json({ message: "furniture_type and unit_price are required" });
    }

    const imageUrl = saveBase64Image(preview_image);

    const result = await db.query(
      `INSERT INTO cart_items (user_id, furniture_type, skeleton_type, configuration, unit_price, preview_image)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, furniture_type, unit_price, preview_image, created_at`,
      [req.userId, furniture_type, skeleton_type, JSON.stringify(configuration || {}), unit_price, imageUrl]
    );

    res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// DELETE /api/cart/:id  — remove item
export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, req.userId]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};
