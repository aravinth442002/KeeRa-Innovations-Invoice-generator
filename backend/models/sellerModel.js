const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  gstin: { type: String, required: true },
  bank: {
    name: String,
    branch: String,
    accountNumber: String,
    ifsc: String,
    upiId: String
  },
});

module.exports = mongoose.model("Seller", sellerSchema);
