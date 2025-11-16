const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema({
  customer: String,
  amount: Number,
  status: String,
  expiryDate: String,
});

module.exports = mongoose.model("Quotation", quotationSchema);
