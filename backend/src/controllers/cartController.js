import db from "../db/db.js";
import { uploadBase64Image } from "../utils/cloudinary.js";

// GET /api/cart
export const getCartItems = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, is_custom, furniture_type, skeleton_type, configuration,
              quantity, unit_price, preview_image, product_id, item_name, created_at
       FROM cart_items WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );
    res.json({ items: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// POST /api/cart — add custom furniture or regular product
export const addCartItem = async (req, res) => {
  try {
    const {
      furniture_type, skeleton_type, configuration, unit_price, preview_image,
      product_id, item_name, is_custom, quantity,
    } = req.body;

    const itemQuantity = Math.max(1, parseInt(quantity) || 1);

    if (unit_price == null) {
      return res.status(400).json({ message: "unit_price is required" });
    }

    const isCustomItem = is_custom !== false;

    if (isCustomItem && !furniture_type) {
      return res.status(400).json({ message: "furniture_type is required for custom items" });
    }
    if (!isCustomItem && (!product_id || !item_name)) {
      return res.status(400).json({ message: "product_id and item_name are required for product items" });
    }

    const imageUrl = isCustomItem ? await uploadBase64Image(preview_image, "comfyhome/cart") : (preview_image || null);

    // Upsert: if same product already in cart, increment quantity
    if (!isCustomItem && product_id) {
      const existing = await db.query(
        `SELECT id, quantity FROM cart_items WHERE user_id = $1 AND product_id = $2`,
        [req.userId, product_id]
      );
      if (existing.rows.length > 0) {
        const updated = await db.query(
          `UPDATE cart_items SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2 RETURNING id, item_name, unit_price, quantity, preview_image, created_at`,
          [itemQuantity, existing.rows[0].id]
        );
        return res.status(200).json({ item: updated.rows[0] });
      }
    }

    const result = await db.query(
      `INSERT INTO cart_items
         (user_id, is_custom, furniture_type, skeleton_type, configuration, unit_price, preview_image, product_id, item_name, quantity)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, is_custom, furniture_type, unit_price, quantity, preview_image, product_id, item_name, created_at`,
      [
        req.userId,
        isCustomItem,
        furniture_type || null,
        skeleton_type || null,
        JSON.stringify(configuration || {}),
        unit_price,
        imageUrl,
        product_id || null,
        item_name || null,
        itemQuantity,
      ]
    );

    res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    if (err.code === "23503" && err.constraint === "cart_items_user_id_fkey") {
      return res.status(401).json({ message: "User account not found. Please log in first." });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// PATCH /api/cart/:id — update quantity
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "quantity must be >= 1" });
    }

    const result = await db.query(
      `UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING id, quantity`,
      [quantity, id, req.userId]
    );

    if (!result.rows.length) return res.status(404).json({ message: "Item not found" });
    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update item" });
  }
};

// DELETE /api/cart/:id — remove one item
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

// DELETE /api/cart — clear entire cart
export const clearCart = async (req, res) => {
  try {
    await db.query(`DELETE FROM cart_items WHERE user_id = $1`, [req.userId]);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
