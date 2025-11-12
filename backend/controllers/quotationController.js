const sampleData = require('../sample.json');

exports.createQuotation = (req, res) => {
  res.status(201).json({ success: true, message: "Quotation created", data: req.body });
};

exports.getQuotations = (req, res) => {
  const quotations = sampleData.quotations || [];
  res.status(200).json({ success: true, data: quotations });
};

exports.getQuotationById = (req, res) => {
    const quotation = sampleData.quotations.find(c => c.id === req.params.id);
    if (quotation) {
        res.status(200).json({ success: true, data: quotation });
    } else {
        res.status(404).json({ success: false, message: "Quotation not found" });
    }
};

exports.updateQuotation = (req, res) => {
    res.status(200).json({ success: true, message: `Quotation ${req.params.id} updated`, data: req.body });
};

exports.deleteQuotation = (req, res) => {
    res.status(200).json({ success: true, message: `Quotation ${req.params.id} deleted` });
};
