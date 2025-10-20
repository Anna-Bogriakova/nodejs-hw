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

const router = Router();

// ✅ правильне використання celebrate()
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
