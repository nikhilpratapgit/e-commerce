import express from "express";

import { getDashboard,createAdmin } from "../controllers/admin.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getDashboard
);  
router.post(
  "/register",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createAdmin
);

export default router;