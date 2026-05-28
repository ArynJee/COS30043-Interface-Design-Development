import express from "express";
import { getCartItems, addCartItem, removeCartItem } from "../controllers/cartController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getCartItems);
router.post("/", authenticate, addCartItem);
router.delete("/:id", authenticate, removeCartItem);

export default router;
