const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { requireAdmin } = require("../middleware/adminAuth");
const Product = require("../models/Product");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/products - list all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to load products" });
  }
});

// GET /api/products/:id - single product
router.get("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to load product" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const { name, tamilName = "", weight, weightLabel = weight, price, description = "", image = "" } = req.body;

  if (!name || !weight || !Number.isFinite(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ message: "Name, weight, and a valid price are required" });
  }

  try {
    const product = await Product.create({
      name: String(name).trim(),
      tamilName: String(tamilName).trim(),
      weight: String(weight).trim(),
      weightLabel: String(weightLabel).trim(),
      price: Number(price),
      description: String(description).trim(),
      image: String(image).trim(),
    });
    res.status(201).json(product);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Failed to create product" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const { name, weight, price } = req.body;
  if (!name || !weight || !Number.isFinite(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ message: "Name, weight, and a valid price are required" });
  }

  try {
    const update = { ...req.body, price: Number(price) };
    if (typeof update.image === "string") update.image = update.image.trim();

    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Failed to update product" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;