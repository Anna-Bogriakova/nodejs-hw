import { Router } from "express";
import { celebrate } from "celebrate";
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from "../validations/authValidation.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail,
  resetPassword,
} from "../controllers/authController.js";

const router = Router();

// 🔹 Реєстрація
router.post("/register", celebrate(registerUserSchema), registerUser);

// 🔹 Логін
router.post("/login", celebrate(loginUserSchema), loginUser);

// 🔹 Оновлення сесії (без authenticate)
router.post("/refresh", refreshUserSession);

// 🔹 Логаут (без authenticate)
router.post("/logout", logoutUser);

// 🔹 Надсилання email для скидання паролю
router.post(
  "/request-reset-email",
  celebrate(requestResetEmailSchema),
  requestResetEmail
);

// 🔹 Скидання паролю
router.post("/reset-password", celebrate(resetPasswordSchema), resetPassword);

export default router;
