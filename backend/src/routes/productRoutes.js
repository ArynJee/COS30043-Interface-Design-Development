import express from "express";
import { getProducts, getFilters } from "../controllers/productController.js";

const router = express.Router();

// /filters must be before / so it isn't swallowed by a future /:id route
router.get("/filters", getFilters);
router.get("/", getProducts);

export default router;
