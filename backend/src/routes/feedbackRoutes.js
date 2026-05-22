import express from "express";
import { getFeedbacks, createFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

// GET: fetch all feedbacks
router.get("/", getFeedbacks);

// POST: create feedback
router.post("/", createFeedback);

export default router;