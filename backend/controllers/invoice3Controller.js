
const sampleData = require('../sample.json');

// Placeholder for invoice3 controller logic
exports.createInvoice = (req, res) => {
  res.status(201).json({ success: true, message: "Invoice created", data: req.body });
};

exports.getInvoices = (req, res) => {
  const invoices = sampleData.invoices || [];
  res.status(200).json({ success: true, data: invoices });
};
