import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} from "../controllers/order.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

// User
router.post(
  "/",
  authMiddleware,
  createOrder
);

router.get(
  "/",
  authMiddleware,
  getMyOrders
);

// Admin
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllOrders
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateOrderStatus
);

// User
router.get(
  "/:id",
  authMiddleware,
  getOrderById
);
// order cancel
router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelOrder
);

export default router;