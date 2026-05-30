import express from "express";
import {
  getContributions,
  createContribution,
  getMyContributions,
  getContribution,
  getContributionReviews,
  addContributionReview,
} from "../controllers/showcaseController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// /mine must be before /:id so it isn't captured by the param route
router.get("/mine", authenticate, getMyContributions);
router.get("/", getContributions);
router.post("/", authenticate, createContribution);
router.get("/:id", getContribution);
router.get("/:id/reviews", getContributionReviews);
router.post("/:id/reviews", authenticate, addContributionReview);

export default router;
