import { Joi, Segments } from "celebrate";

// 🔹 Реєстрація користувача
export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

// 🔹 Логін користувача
export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// 🔹 Запит на скидання паролю (надсилання листа)
export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
  }),
};

// 🔹 Скидання паролю (через токен)
export const resetPasswordSchema = {
  [Segments.BODY]: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
};
