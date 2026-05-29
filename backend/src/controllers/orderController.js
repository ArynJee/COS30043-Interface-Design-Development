import Stripe from "stripe";
import db from "../db/db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/orders/create-payment-intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { itemIds } = req.body;

    if (!itemIds || !itemIds.length) {
      return res.status(400).json({ message: "itemIds are required" });
    }

    const result = await db.query(
      `SELECT SUM(unit_price * quantity) AS total
       FROM cart_items WHERE id = ANY($1) AND user_id = $2`,
      [itemIds, req.userId]
    );

    const total = parseFloat(result.rows[0].total) || 0;
    if (total <= 0) return res.status(400).json({ message: "Cart total is zero" });

    const amountInCents = Math.round(total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: { userId: String(req.userId) },
    });

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id, amount: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
};

// POST /api/orders/confirm
export const confirmOrder = async (req, res) => {
  try {
    const { paymentIntentId, itemIds, shippingInfo } = req.body;

    if (!paymentIntentId || !itemIds?.length || !shippingInfo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment has not been completed" });
    }

    // Fetch the cart items being ordered
    const itemsResult = await db.query(
      `SELECT * FROM cart_items WHERE id = ANY($1) AND user_id = $2`,
      [itemIds, req.userId]
    );

    const items = itemsResult.rows;
    if (!items.length) return res.status(404).json({ message: "Cart items not found" });

    const subtotal = items.reduce(
      (sum, i) => sum + parseFloat(i.unit_price) * i.quantity,
      0
    );

    // Create the order record
    const orderResult = await db.query(
      `INSERT INTO orders
         (user_id, status, subtotal, total_amount, shipping_name, shipping_address,
          shipping_city, shipping_state, shipping_zip, stripe_payment_intent_id)
       VALUES ($1, 'paid', $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.userId,
        subtotal,
        subtotal,
        shippingInfo.name,
        shippingInfo.address,
        shippingInfo.city,
        shippingInfo.state,
        shippingInfo.zip,
        paymentIntentId,
      ]
    );

    const order = orderResult.rows[0];

    // Create order_items and update product sold counts
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items
           (order_id, item_type, product_id, item_name, unit_price, quantity, configuration, preview_image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          order.id,
          item.is_custom ? "custom" : "product",
          item.product_id || null,
          item.item_name || item.furniture_type,
          item.unit_price,
          item.quantity,
          JSON.stringify(item.configuration || {}),
          item.preview_image || null,
        ]
      );

      if (!item.is_custom && item.product_id) {
        await db.query(
          `UPDATE products SET sold_count = sold_count + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
          [item.quantity, item.product_id]
        );
      }
    }

    // Remove ordered items from cart
    await db.query(
      `DELETE FROM cart_items WHERE id = ANY($1) AND user_id = $2`,
      [itemIds, req.userId]
    );

    res.json({
      order: {
        id: order.id,
        status: order.status,
        total: subtotal,
        createdAt: order.created_at,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to confirm order" });
  }
};

// GET /api/orders — user's past orders
export const getUserOrders = async (req, res) => {
  try {
    const ordersResult = await db.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );

    const orders = ordersResult.rows;

    for (const order of orders) {
      const itemsResult = await db.query(
        `SELECT * FROM order_items WHERE order_id = $1 ORDER BY id ASC`,
        [order.id]
      );
      order.items = itemsResult.rows;
    }

    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
