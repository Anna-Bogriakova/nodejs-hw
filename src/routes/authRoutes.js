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

const router = Router();

// ✅ Реєстрація
router.post("/register", celebrate(registerUserSchema), registerUser);

// ✅ Логін
router.post("/login", celebrate(loginUserSchema), loginUser);

// ✅ Оновлення сесії (без authenticate)
router.post("/refresh", refreshUserSession);

// ✅ Логаут (без authenticate)
router.post("/logout", logoutUser);

export default router;
