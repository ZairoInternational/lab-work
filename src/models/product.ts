import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // e.g. "trinocular-xyz"
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, default: 0 },
    images: [{ type: String }],
    shortDescription: { type: String },
    description: { type: String },
    specs: { type: Schema.Types.Mixed }, // key-value spec table
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);
