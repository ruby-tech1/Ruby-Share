import express from "express";
const router = express.Router();

import {
  login,
  logout,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/AuthController.js";
import { AutheticateUser } from "../middleware/authentication.js";

router.route("/login").post(login);
router.route("/logout").delete(AutheticateUser, logout);
router.route("/register").post(register);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

export default router;
