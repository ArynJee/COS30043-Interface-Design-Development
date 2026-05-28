import express from "express";
import { getContributions, createContribution } from "../controllers/showcaseController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getContributions);
router.post("/", authenticate, createContribution);

export default router;
