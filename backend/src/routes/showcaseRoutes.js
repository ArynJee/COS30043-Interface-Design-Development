import express from "express";
import { getContributions, createContribution, getMyContributions } from "../controllers/showcaseController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/mine", authenticate, getMyContributions);
router.get("/", getContributions);
router.post("/", authenticate, createContribution);

export default router;
