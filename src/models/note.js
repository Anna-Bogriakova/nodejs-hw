import { Schema, model } from "mongoose";
import { TAGS } from "../constants/tags.js"; // ✅ імпортуємо константу

const noteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: "" },
    tag: {
      type: String,
      enum: TAGS, // ✅ використовуємо імпортований масив
      default: "Todo",
      trim: true,
    },
  },
  { timestamps: true }
);

// 🆕 Текстовий індекс для пошуку
noteSchema.index({ title: "text", content: "text" });

export const Note = model("Note", noteSchema);
