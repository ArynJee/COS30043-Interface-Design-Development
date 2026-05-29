import express from "express";
import { createPaymentIntent, confirmOrder, getUserOrders } from "../controllers/orderController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-payment-intent", authenticate, createPaymentIntent);
router.post("/confirm", authenticate, confirmOrder);
router.get("/", authenticate, getUserOrders);

export default router;
