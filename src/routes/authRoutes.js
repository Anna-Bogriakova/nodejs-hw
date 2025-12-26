import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from "../controllers/authController.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/authValidation.js";

const router = Router();

router.post("/auth/register", registerUserSchema, registerUser);
router.post("/auth/login", loginUserSchema, loginUser);
router.post("/auth/refresh", refreshUserSession); // no body; cookies used
router.post("/auth/logout", logoutUser); // no body; cookies used

export default router;
