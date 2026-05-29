import express from "express";
import {
  getCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getCartItems);
router.post("/", authenticate, addCartItem);
router.patch("/:id", authenticate, updateCartItem);
router.delete("/", authenticate, clearCart);
router.delete("/:id", authenticate, removeCartItem);

export default router;
