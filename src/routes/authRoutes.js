import { celebrate } from "celebrate";
import { Router } from "express";
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

router.post("/auth/register", celebrate(registerUserSchema), registerUser);
router.post("/auth/login", celebrate(loginUserSchema), loginUser);
router.post("/auth/refresh", refreshUserSession);
router.post("/auth/logout", logoutUser);

export default router;
