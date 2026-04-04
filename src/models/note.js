import { Schema, model } from "mongoose";
import { TAGS } from "../constants/tags.js";

const noteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: "" },
    tag: {
      type: String,
      enum: TAGS,
      default: "Todo",
      trim: true,
    },
    // 🆕 поле для зв'язку з користувачем
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // посилання на модель користувача
      required: true,
    },
  },
  { timestamps: true }
);

// 🆕 індекс для пошуку по тексту
noteSchema.index({ title: "text", content: "text" });

// експортуємо модель
export const Note = model("Note", noteSchema);
