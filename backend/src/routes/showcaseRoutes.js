import express from "express";
import { getContributions } from "../controllers/showcaseController.js";

const router = express.Router();

router.get("/", getContributions);

export default router;
