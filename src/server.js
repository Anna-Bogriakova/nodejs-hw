import express from "express";
import cors from "cors";
import "dotenv/config";

import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectMongoDB } from "./db/connectMongoDB.js";
import notesRouter from "./routes/notesRoutes.js";
import { errors } from "celebrate";

const app = express();
const PORT = process.env.PORT ?? 3030;

// ✅ Middleware — у правильному порядку
app.use(express.json());
app.use(cors());
app.use(logger);

// ✅ Підключаємо роутер лише один раз, без дублювання
app.use("/", notesRouter);

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
