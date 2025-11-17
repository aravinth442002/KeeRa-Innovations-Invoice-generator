const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  address: String,
  phone: Number,
  email: String,
  gstin: String,
  bank: {
    name: String,
    branch: String,
    accountNumber: Number,
    ifsc: String,
    upiId: String
  },
});

module.exports = mongoose.model("Seller", sellerSchema);
