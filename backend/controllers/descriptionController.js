const sampleData = require('../sample.json');

// Placeholder for description controller logic
exports.createDescription = (req, res) => {
  // This is a mock implementation. In a real app, you'd save to a database.
  const newDescription = { id: `desc-${Date.now()}`, ...req.body };
  sampleData.descriptions.push(newDescription);
  res.status(201).json({ success: true, message: "Description created", data: newDescription });
};

exports.getDescriptions = (req, res) => {
  const descriptions = sampleData.descriptions || [];
  res.status(200).json({ success: true, data: descriptions });
};

exports.updateDescription = (req, res) => {
    // This is a mock implementation.
    res.status(200).json({ success: true, message: `Description ${req.params.id} updated`, data: req.body });
};

exports.deleteDescription = (req, res) => {
    // This is a mock implementation.
    res.status(200).json({ success: true, message: `Description ${req.params.id} deleted` });
};
