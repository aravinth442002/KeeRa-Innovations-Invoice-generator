const mongoose = require("mongoose");
const { type } = require("os");

const lineItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  hsn: { type: String },
});

const sellerSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  gstin: String,
  bank: {
    name: String,
    branch: String,
    accountNumber: String,
    ifsc: String,
    upiId: String
  }
});

const invoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required:true },
  customerAddress: { type: String, required: true },
  gstin: { type: String, required: true },
  seller: sellerSchema,
  description: { type: String},
  lineItems: [lineItemSchema],
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: Date, required: true },
  dueDate: { type: Date },
  issueDate: { type: Date, required: true },
}, {
  timestamps: true,
});

// The native _id is not returned by default when using toJSON.
// We are using a custom 'id' field which is a string and required.
// So we don't need the virtual 'id' or toJSON transform.

module.exports = mongoose.model("Invoice", invoiceSchema);
