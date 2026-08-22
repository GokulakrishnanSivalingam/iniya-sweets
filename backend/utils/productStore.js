const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "..", "data", "products.json");

function readProducts() {
  return JSON.parse(fs.readFileSync(productsPath, "utf8"));
}

function writeProducts(products) {
  fs.writeFileSync(productsPath, `${JSON.stringify(products, null, 2)}\n`);
}

module.exports = { readProducts, writeProducts };
