const Seller = require("../models/sellerModel");

exports.createSeller = async (req, res) => {
  try {
    const seller = await Seller.create(req.body);
    res.status(201).json({
      success: true,
      data: seller,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.status(200).json({
      success: true,
      count: sellers.length,
      data: sellers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.getSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

exports.updateSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true, 
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

exports.deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        error: "Seller not found",
      });
    }

    res.status(204).json({
      success: true,
      data: {}, 
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};