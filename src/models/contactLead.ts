import mongoose, { Schema, model, models } from "mongoose";

const ContactLeadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    companyName: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.ContactLead || model("ContactLead", ContactLeadSchema);
