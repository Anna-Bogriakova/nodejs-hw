import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";

import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectMongoDB } from "./db/connectMongoDB.js";

import notesRouter from "./routes/notesRoutes.js";
import authRouter from "./routes/authRoutes.js"; // ✅

const app = express();
const PORT = process.env.PORT ?? 3030;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(logger);

app.use("/auth", authRouter); // ✅ важливо
app.use("/notes", notesRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const bootstrap = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

bootstrap();
