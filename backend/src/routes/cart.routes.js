import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cart.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();


// Get current user's cart
router.get(
  "/",
  authMiddleware,
  getCart
);


// Add product to cart
router.post(
  "/items",
  authMiddleware,
  addToCart
);


// Update product quantity
router.put(
  "/items/:productId",
  authMiddleware,
  updateCartItem
);


// Remove product from cart
router.delete(
  "/items/:productId",
  authMiddleware,
  removeFromCart
);


// Clear entire cart
router.delete(
  "/",
  authMiddleware,
  clearCart
);


export default router;