
// Placeholder for description controller logic
exports.createDescription = (req, res) => {
  res.status(201).json({ success: true, message: "Description created" });
};

exports.getDescriptions = (req, res) => {
  res.status(200).json({ success: true, data: [] });
};
