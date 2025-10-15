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

// Middleware
app.use("/", notesRouter);
app.use(express.json());
app.use(cors());
app.use(logger);

// Routes
app.use(notesRouter); // ✅ без префікса /notes

// Middleware for errors
app.use(notFoundHandler);
app.use(errors()); // обробка помилок Celebrate
app.use(errorHandler);

// Start server after DB connection
const bootstrap = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

bootstrap();
