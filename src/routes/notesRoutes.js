import { Router } from "express";
import { celebrate } from "celebrate";

import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/notesController.js";

import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from "../validations/notesValidation.js";

import { authenticate } from "../middleware/authenticate.js"; // 🆕 імпорт

const router = Router();

// 🧩 Усі маршрути нотаток тепер захищені
router.use(authenticate);

router.get("/", celebrate({ query: getAllNotesSchema }), getAllNotes);
router.get("/:noteId", celebrate({ params: noteIdSchema }), getNoteById);
router.post("/", celebrate({ body: createNoteSchema }), createNote);
router.patch(
  "/:noteId",
  celebrate({ params: noteIdSchema, body: updateNoteSchema }),
  updateNote
);
router.delete("/:noteId", celebrate({ params: noteIdSchema }), deleteNote);

export default router;
