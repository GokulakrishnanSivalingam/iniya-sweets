require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not set — aborting.");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  const jsonPath = path.join(__dirname, "..", "data", "products.json");
  const oldProducts = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  const docs = oldProducts.map(({ id, ...rest }) => {
    // Old local upload paths (/uploads/...) aren't real links anymore —
    // clear them out so you can paste a real image URL in the admin panel.
    const image = rest.image && rest.image.startsWith("http") ? rest.image : "";
    return { ...rest, image };
  });

  const result = await Product.insertMany(docs);
  console.log(`Seeded ${result.length} product(s).`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});