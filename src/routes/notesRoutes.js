import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/notesController.js";

const router = Router();

// ✅ Схеми валідації
const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({}),
};

const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().hex().length(24).required(),
  }),
};

const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }),
};

const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().hex().length(24).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().optional(),
    content: Joi.string().optional(),
  }),
};

// ✅ Маршрути
router.get("/notes", celebrate(getAllNotesSchema), getAllNotes);
router.get("/notes/:noteId", celebrate(noteIdSchema), getNoteById);
router.post("/notes", celebrate(createNoteSchema), createNote);
router.patch("/notes/:noteId", celebrate(updateNoteSchema), updateNote);
router.delete("/notes/:noteId", celebrate(noteIdSchema), deleteNote);

export default router;
