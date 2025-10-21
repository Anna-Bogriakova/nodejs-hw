import { Router } from "express";
import { celebrate } from "celebrate";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/authValidation.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from "../controllers/authController.js";

import { authenticate } from "../middleware/authenticate.js"; // ✅ добавляем middleware

const router = Router();

router.post("/register", celebrate(registerUserSchema), registerUser);
router.post("/login", celebrate(loginUserSchema), loginUser);
router.post("/refresh", authenticate, refreshUserSession);
router.post("/logout", authenticate, logoutUser);

export default router;
