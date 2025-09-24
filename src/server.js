import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pino from "pino-http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;

// middleware
app.use(cors());
app.use(express.json());
app.use(pino());

// ========== ROUTES ==========

// GET /notes — повертає всі нотатки
app.get("/notes", (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes",
  });
});

// GET /notes/:noteId — повертає одну нотатку
app.get("/notes/:noteId", (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

// GET /test-error — симуляція помилки
app.get("/test-error", () => {
  throw new Error("Simulated server error");
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// старт сервера
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my API 🚀" });
});
