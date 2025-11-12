const sampleData = require('../sample.json');

// Placeholder for description controller logic
exports.createDescription = (req, res) => {
  res.status(201).json({ success: true, message: "Description created", data: req.body });
};

exports.getDescriptions = (req, res) => {
  // Assuming sample.json might have descriptions in the future
  const descriptions = sampleData.descriptions || [];
  res.status(200).json({ success: true, data: descriptions });
};
