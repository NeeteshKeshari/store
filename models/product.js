// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  selectedProduct: { type: String, required: true },
  quantity: { type: Number, required: true },
  actualCost: { type: Number, required: true },
  sellingCost: { type: Number, required: true },
  date: { type: Date, required: true },
  packingCharge: { type: Number, required: true },
  pouchCharge: { type: Number, required: true },

  extraCharge: { type: Number, default: 0 },
  pisaiCharge: { type: Number, required: true },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
