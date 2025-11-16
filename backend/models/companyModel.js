// models/Company.js
const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    // --- Office Details ---
    companyName: {
        type: String,
        required: [true, 'Company Name is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        // Simple regex for email validation
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid email address'] 
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number is required'],
        trim: true,
    },
    // For file path/URL, handling actual file upload is complex and omitted here
    companySignatureUrl: {
        type: String,
        default: 'N/A'
    },
    companySealUrl: {
        type: String,
        default: 'N/A'
    },

    // --- Tax Details ---
    taxId: {
        type: String,
        trim: true,
    },
    vatNumber: {
        type: String,
        trim: true,
    },

    // --- Bank Details ---
    bankName: {
        type: String,
        trim: true,
    },
    accountNumber: {
        type: String,
        trim: true,
    },
    swiftBicCode: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true 
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;