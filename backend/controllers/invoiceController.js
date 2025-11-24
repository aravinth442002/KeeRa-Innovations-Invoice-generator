const Invoice = require("../models/invoiceModel");

exports.createInvoice = async (req, res) => {

  try {
    // Check if an invoice with this ID already exists to prevent duplicates
    const existingInvoice = await Invoice.findOne({ id: req.body.id });
    if (existingInvoice) {
      return res.status(409).json({ message: "Invoice with this ID already exists." });
    }
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    // Sort by id ascending to get the oldest invoices first
    const invoices = await Invoice.find().sort({ id: 1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    // Use the custom `id` field for lookup instead of mongo's `_id`
    const invoice = await Invoice.findOne({ id: req.params.id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    // Use the custom `id` field for lookup
    const invoice = await Invoice.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    // Use the custom `id` field for lookup
    const invoice = await Invoice.findOneAndDelete({ id: req.params.id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
