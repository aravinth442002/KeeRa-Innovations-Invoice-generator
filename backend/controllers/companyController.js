// controllers/companyController.js
const Company = require('../models/companyModel');

// POST a new company (Create)
exports.createCompany = async (req, res) => {
    try {
        const newCompany = new Company(req.body);
        console.log("*/*/**/*//*/*/*/", req.body);
        const savedCompany = await newCompany.save();
        res.status(201).json(savedCompany); // 201 Created
    } catch (error) {
        // Mongoose validation errors or unique constraint errors
        res.status(400).json({ message: error.message });
    }
};

// GET all companies (Read All)
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET a single company by ID (Read One)
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT/PATCH to update a company (Update)
exports.updateCompany = async (req, res) => {
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // Return the new document, run schema validators
        );
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(updatedCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE a company (Delete)
exports.deleteCompany = async (req, res) => {
    try {
        const deletedCompany = await Company.findByIdAndDelete(req.params.id);
        if (!deletedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(204).json({ message: 'Company deleted successfully' }); // 204 No Content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};