import createHttpError from "http-errors";
import { Note } from "../models/note.js";

// ✅ Отримати всі нотатки поточного користувача
export const getAllNotes = async (req, res, next) => {
  try {
    const { tag, search, page = 1, perPage = 10 } = req.query;
    const { _id: userId } = req.user;

    const filter = { userId }; // 🆕 показуємо тільки нотатки користувача

    if (tag) filter.tag = tag;
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * perPage;

    const [notes, totalNotes] = await Promise.all([
      Note.find(filter).skip(skip).limit(Number(perPage)),
      Note.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Отримати одну нотатку (лише свою)
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { _id: userId } = req.user;

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) throw createHttpError(404, "Note not found");

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// ✅ Створити нову нотатку (з userId)
export const createNote = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const note = await Note.create({ ...req.body, userId });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// ✅ Оновити нотатку (лише свою)
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { _id: userId } = req.user;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      req.body,
      { new: true }
    );

    if (!note) throw createHttpError(404, "Note not found");
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// ✅ Видалити нотатку (лише свою)
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { _id: userId } = req.user;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) throw createHttpError(404, "Note not found");

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};
