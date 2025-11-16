const mongoose = require("mongoose");

const descriptionSchema = new mongoose.Schema({
  title: String,
  content: String,
});

module.exports = mongoose.model("Description", descriptionSchema);
