const sampleData = require('../sample.json');

// Placeholder for client controller logic
exports.createClient = (req, res) => {
  res.status(201).json({ success: true, message: "Client created", data: req.body });
};

exports.getClients = (req, res) => {
  res.status(200).json({ success: true, data: sampleData.clients });
};

exports.getClientById = (req, res) => {
    const client = sampleData.clients.find(c => c.id === req.params.id);
    if (client) {
        res.status(200).json({ success: true, data: client });
    } else {
        res.status(404).json({ success: false, message: "Client not found" });
    }
};

exports.updateClient = (req, res) => {
    res.status(200).json({ success: true, message: `Client ${req.params.id} updated`, data: req.body });
};

exports.deleteClient = (req, res) => {
    res.status(200).json({ success: true, message: `Client ${req.params.id} deleted` });
};
