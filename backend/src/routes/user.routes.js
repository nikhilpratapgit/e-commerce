import express from "express";

import {
  createUser,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = express.Router();

// router.post(
//   "/",
//   authMiddleware,
//   roleMiddleware("ADMIN"),
//   createUser
// );

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

router.delete(
  "/account",
  authMiddleware,
  deleteAccount
);
export default router;