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

// 🔓 Открытые маршруты (без токена)
router.post("/auth/register", celebrate(registerUserSchema), registerUser);
router.post("/auth/login", celebrate(loginUserSchema), loginUser);

// 🔐 Закрытые маршруты (требуют токен)
router.post("/auth/refresh", authenticate, refreshUserSession);
router.post("/auth/logout", authenticate, logoutUser);

export default router;
