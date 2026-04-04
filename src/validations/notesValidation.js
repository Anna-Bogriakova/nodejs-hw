import { Joi, celebrate, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";
import { TAGS } from "../constants/tags.js";

// Валідація для GET /notes
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().allow(""),
  }),
};

// Валідація для :noteId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation"),
  }),
};

// POST /notes
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow(""),
    tag: Joi.string().valid(...TAGS),
  }),
};

// PATCH /notes/:noteId
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation"),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(""),
    tag: Joi.string().valid(...TAGS),
  })
    .min(1)
    .messages({
      "object.min":
        "At least one field (title, content, or tag) must be provided",
    }),
};
