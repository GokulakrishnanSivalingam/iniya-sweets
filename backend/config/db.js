const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn(
      "⚠  MONGO_URI is not set. Skipping MongoDB connection — orders will not be saved."
    );
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✔ MongoDB connected");
  } catch (err) {
    console.error("✘ MongoDB connection error:", err.message);
    // Do not crash the whole server if DB is unavailable in dev;
    // in production you may want process.exit(1) here instead.
  }
}

module.exports = connectDB;
