const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/adminAuth");
const { readProducts, writeProducts } = require("../utils/productStore");
const { uploadProductImage } = require("../utils/imageUpload");

// GET /api/products - list all products
router.get("/", (req, res) => {
  res.json(readProducts());
});

// GET /api/products/:id - single product (useful for server-side price verification)
router.get("/:id", (req, res) => {
  const product = readProducts().find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

router.post("/upload-image", requireAdmin, uploadProductImage.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "An image is required" });
  res.status(201).json({ image: `/uploads/${req.file.filename}` });
});

router.post("/", requireAdmin, (req, res) => {
  const { name, tamilName = "", weight, weightLabel = weight, price, description = "" } = req.body;
  if (!name || !weight || !Number.isFinite(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ message: "Name, weight, and a valid price are required" });
  }
  const products = readProducts();
  const product = {
    id: products.reduce((max, item) => Math.max(max, item.id), 0) + 1,
    name: String(name).trim(), tamilName: String(tamilName).trim(),
    weight: String(weight).trim(), weightLabel: String(weightLabel).trim(),
    price: Number(price), description: String(description).trim(),
    image: String(req.body.image || "").trim(),
  };
  products.push(product);
  writeProducts(products);
  res.status(201).json(product);
});

router.put("/:id", requireAdmin, (req, res) => {
  const products = readProducts();
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });
  const current = products[index];
  const next = { ...current, ...req.body, id: current.id, price: Number(req.body.price), image: String(req.body.image || current.image || "").trim() };
  if (!next.name || !next.weight || !Number.isFinite(next.price) || next.price < 0) {
    return res.status(400).json({ message: "Name, weight, and a valid price are required" });
  }
  products[index] = next;
  writeProducts(products);
  res.json(next);
});

router.delete("/:id", requireAdmin, (req, res) => {
  const products = readProducts();
  const remaining = products.filter((p) => p.id !== Number(req.params.id));
  if (remaining.length === products.length) return res.status(404).json({ message: "Product not found" });
  writeProducts(remaining);
  res.status(204).end();
});

module.exports = router;
module.exports.getProducts = readProducts;
