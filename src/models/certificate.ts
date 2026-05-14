import mongoose, { Schema, model, models } from "mongoose";

const CertificateSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Certificate || model("Certificate", CertificateSchema);
