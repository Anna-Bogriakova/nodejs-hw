import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";

import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectMongoDB } from "./db/connectMongoDB.js";

// 🆕 Імпорти нових роутів
import notesRouter from "./routes/notesRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3030;

// ✅ Middleware — у правильному порядку
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // або можна поставити точний домен, наприклад, "https://yourapp.onrender.com"
    credentials: true, // 🆕 дозволяє передавати cookies
  })
);
app.use(logger);

// ✅ Роутинг
app.use("/auth", authRouter); // 🆕 маршрути для реєстрації/логіну/сесій
app.use("/notes", notesRouter); // 🆕 усі нотатки тепер захищені (через middleware authenticate у routes)

// ✅ Middleware для обробки помилок (у правильному порядку)
app.use(notFoundHandler);
app.use(errors()); // Celebrate errors — лише тут!
app.use(errorHandler);

// ✅ Запускаємо сервер після підключення до БД
const bootstrap = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

bootstrap();
