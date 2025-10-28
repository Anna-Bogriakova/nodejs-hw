// src/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";

import { connectMongoDB } from "./db/connectMongoDB.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// middleware - order matters
app.use(logger);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_DOMAIN || true,
    credentials: true,
  })
);

// healthcheck / root
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/users", userRoutes);

// error handling
app.use(notFoundHandler);
app.use(errors()); // celebrate error handler
app.use(errorHandler);

const bootstrap = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
