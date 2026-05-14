import mongoose, { Schema, model, models } from "mongoose";

const SiteClientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.SiteClient || model("SiteClient", SiteClientSchema);
