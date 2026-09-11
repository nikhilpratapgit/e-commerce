import express from "express";

import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
} from "../controllers/review.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();


// Get all reviews for a product
router.get(
  "/products/:productId/reviews",
  getProductReviews
);


// Create review
router.post(
  "/products/:productId/reviews",
  authMiddleware,
  createReview
);


// Update review
router.put(
  "/products/:productId/reviews/:reviewId",
  authMiddleware,
  updateReview
);


// Delete review
router.delete(
  "/products/:productId/reviews/:reviewId",
  authMiddleware,
  deleteReview
);


export default router;