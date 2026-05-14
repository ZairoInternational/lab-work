import mongoose, { Schema, model, models } from "mongoose";

const SiteReviewSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    photo: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.SiteReview || model("SiteReview", SiteReviewSchema);
