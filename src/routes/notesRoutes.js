import { Router } from "express";
import { celebrate, Joi, Segments, errors } from "celebrate";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/notesController.js";

const router = Router();

// Schemas
const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({}), // пустой объект, если query нет
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
  [Segments.BODY]: Joi.object({
    title: Joi.string().optional(),
    content: Joi.string().optional(),
  }),
};

// Routes
router.get("/", getAllNotes);
router.get("/notes", celebrate(getAllNotesSchema), getAllNotes);
router.get("/notes/:noteId", celebrate(noteIdSchema), getNoteById);
router.post("/notes", celebrate(createNoteSchema), createNote);
router.delete("/notes/:noteId", celebrate(noteIdSchema), deleteNote);
router.patch("/notes/:noteId", celebrate(updateNoteSchema), updateNote);

// Celebrate error handler (добавь после всех маршрутов)
router.use(errors());

export default router;
