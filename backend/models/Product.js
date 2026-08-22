const mongoose = require("mongoose");

const urlPattern = /^https?:\/\/.+/i;

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tamilName: { type: String, default: "", trim: true },
    weight: { type: String, required: true, trim: true },
    weightLabel: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "", trim: true },
    image: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator: (value) => value === "" || urlPattern.test(value),
        message: "Image must be a valid http(s) link",
      },
    },
  },
  { timestamps: true }
);

// Keep the frontend's product.id shape working (it currently expects a plain "id")
productSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Product", productSchema);