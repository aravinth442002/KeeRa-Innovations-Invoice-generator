const Quotation = require("../models/quotationModel");

exports.createQuotation = async (req, res) => {
  try {
    const quotation = new Quotation(req.body);
    await quotation.save();
    res.status(201).json(quotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find();
    res.status(200).json(quotations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });
    res.status(200).json(quotation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });
    res.status(200).json(quotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });
    res.status(200).json({ message: "Quotation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
