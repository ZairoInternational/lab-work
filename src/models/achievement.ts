import mongoose, { Schema, model, models } from "mongoose";

const AchievementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    photo: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Achievement || model("Achievement", AchievementSchema);
