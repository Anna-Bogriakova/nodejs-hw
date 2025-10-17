import { Router } from "express";
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

// ✅ правильні маршрути з урахуванням зауважень ментора
router.get("/notes", getAllNotesSchema, getAllNotes);
router.get("/notes/:noteId", noteIdSchema, getNoteById);
router.post("/notes", createNoteSchema, createNote);
router.patch("/notes/:noteId", updateNoteSchema, updateNote);
router.delete("/notes/:noteId", noteIdSchema, deleteNote);

export default router;
