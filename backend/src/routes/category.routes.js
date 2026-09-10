import express from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();


// Public routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);


// Admin routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCategory
);

export default router;