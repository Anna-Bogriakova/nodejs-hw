import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectMongoDB } from "./db/connectMongoDB.js";
import notesRoutes from "./routes/notesRoutes.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

// middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// routes
app.use("/notes", notesRoutes);

// 404 handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

// старт сервера після з’єднання з MongoDB
const startServer = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

startServer();
