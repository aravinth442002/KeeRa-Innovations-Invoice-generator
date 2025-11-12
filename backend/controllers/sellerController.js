
const sampleData = require('../sample.json');

// Placeholder for seller controller logic
exports.getSellerInfo = (req, res) => {
  if (sampleData.seller) {
    res.status(200).json({ success: true, data: sampleData.seller });
  } else {
    res.status(404).json({ success: false, message: "Seller info not found" });
  }
};

exports.updateSellerInfo = (req, res) => {
    res.status(200).json({ success: true, message: "Seller info updated", data: req.body });
};
