const Description = require("../models/descriptionModel");

exports.createDescription = async (req, res) => {
  try {
    const description = new Description(req.body);
    await description.save();
    res.status(201).json(description);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getDescriptions = async (req, res) => {
  try {
    const descriptions = await Description.find();
    res.status(200).json({
      success: true,
      data: descriptions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDescriptionById = async (req, res) => {
  try {
    const description = await Description.findById(req.params.id);
    if (!description) return res.status(404).json({ message: "Description not found" });
    res.status(200).json(description);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDescription = async (req, res) => {
  try {
    const description = await Description.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!description) return res.status(404).json({ message: "Description not found" });
    res.status(200).json(description);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDescription = async (req, res) => {
  try {
    const description = await Description.findByIdAndDelete(req.params.id);
    if (!description) return res.status(404).json({ message: "Description not found" });
    res.status(200).json({ message: "Description deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
