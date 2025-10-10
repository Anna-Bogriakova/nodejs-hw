import express from "express";
import cors from "cors";
import "dotenv/config";

import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectMongoDB } from "./db/connectMongoDB.js";
import notesRouter from "./routes/notesRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3030;

app.use(express.json());
app.use(cors());
app.use(logger);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});
app.use("/notes", notesRouter);

import { errors } from "celebrate";

// Middleware
app.use(notFoundHandler);
app.use(errors()); // додаємо обробку помилок валідації
app.use(errorHandler);

// Start server after DB connection
const bootstrap = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

bootstrap();
