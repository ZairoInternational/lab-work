import mongoose from "mongoose";
const Mongo_URL = process.env.MONGO_URL;

console.log("Mongo URL from env:", Mongo_URL); // TEMP debug

export const connectDB = async () => {
  if (!Mongo_URL) {
    throw new Error("❌ MONGODB_URI is missing. Check .env.local");
  }

  try {
    await mongoose.connect(Mongo_URL, { dbName: "BenchtopLabs" });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
};
