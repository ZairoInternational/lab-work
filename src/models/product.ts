import mongoose, { Schema, model, models } from "mongoose";
import  "./category";
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // e.g. "trinocular-xyz"
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: { type: String, default: null },
    pdf: { type: String, default: null },

    shortDescription: { type: String },
    description: { type: String },
    specs: { type: Schema.Types.Mixed }, // key-value spec table
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);
