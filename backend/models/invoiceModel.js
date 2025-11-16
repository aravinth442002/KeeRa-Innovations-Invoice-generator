const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  customer: String,
  amount: Number,
  status: String,
  date: String,
  dueDate: String,
});

module.exports = mongoose.model("Invoice", invoiceSchema);
