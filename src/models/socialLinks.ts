import mongoose, { Schema, model, models } from "mongoose";

const SocialLinksSchema = new Schema(
  {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    youtube: { type: String, default: "" },
    github: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.SocialLinks || model("SocialLinks", SocialLinksSchema);
