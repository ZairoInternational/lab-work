import mongoose, { Schema, model, models } from "mongoose";

const ContactInfoSchema = new Schema(
  {
    address: { type: String, required: true, default: "" },
    phone1: { type: String, required: true, default: "" },
    phone2: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

export default models.ContactInfo || model("ContactInfo", ContactInfoSchema);

