const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      type: Buffer,
      contentType: String,
    },
    photoURL: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
