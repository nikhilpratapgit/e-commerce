import express from "express";

import { getDashboard } from "../controllers/admin.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getDashboard
);  

export default router;