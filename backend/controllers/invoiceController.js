const sampleData = require('../sample.json');

exports.createInvoice = (req, res) => {
  res.status(201).json({ success: true, message: "Invoice created", data: req.body });
};

exports.getInvoices = (req, res) => {
  const invoices = sampleData.invoices || [];
  res.status(200).json({ success: true, data: invoices });
};

exports.getInvoiceById = (req, res) => {
    const invoice = sampleData.invoices.find(c => c.id === req.params.id);
    if (invoice) {
        res.status(200).json({ success: true, data: invoice });
    } else {
        res.status(404).json({ success: false, message: "Invoice not found" });
    }
};

exports.updateInvoice = (req, res) => {
    res.status(200).json({ success: true, message: `Invoice ${req.params.id} updated`, data: req.body });
};

exports.deleteInvoice = (req, res) => {
    res.status(200).json({ success: true, message: `Invoice ${req.params.id} deleted` });
};
