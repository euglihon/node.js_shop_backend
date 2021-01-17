const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 140,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    maxlength: 250,
  },
  imageURL: {
    type: String,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // relation
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
