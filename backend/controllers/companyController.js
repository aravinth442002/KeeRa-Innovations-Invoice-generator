// controllers/companyController.js
const Company = require('../models/companyModel');

exports.createCompany = async (req, res) => {
    try {
        const companyData = {
            ...req.body
        };

        if (req.files && req.files['companySignatureUrl']) {
            companyData.companySignatureUrl = req.files['companySignatureUrl'][0].path; 
        }
        if (req.files && req.files['companySealUrl']) {
            companyData.companySealUrl = req.files['companySealUrl'][0].path; 
        }
        if (req.files && req.files['companyLogo']) {
            companyData.companyLogo = req.files['companyLogo'][0].path; 
        }

        const newCompany = new Company(companyData);
        const savedCompany = await newCompany.save();
        res.status(201).json(savedCompany); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

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
        const updateData = { ...req.body };

        if (req.files) {
            if (req.files['companySignatureUrl']) {
                updateData.companySignatureUrl = req.files['companySignatureUrl'][0].path;
            }
            if (req.files['companySealUrl']) {
                updateData.companySealUrl = req.files['companySealUrl'][0].path;
            }
            if (req.files['companyLogo']) {
                updateData.companyLogo = req.files['companyLogo'][0].path;
            }
        }
        
        const updatedCompany = await Company.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
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
