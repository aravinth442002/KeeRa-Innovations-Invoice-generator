const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  email: String,
  gstin: String,
  bank: {
    name: String,
    accountNumber: String,
    swiftCode: String,
  },
});

module.exports = mongoose.model("Seller", sellerSchema);
