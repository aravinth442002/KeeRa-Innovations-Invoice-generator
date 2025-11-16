const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  gstin: String,
});

module.exports = mongoose.model("Client", clientSchema);
