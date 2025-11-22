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
    // These fields will store the file path/URL returned by Multer
    companySignatureUrl: {
        type: String,
        default: 'N/A' // Default can be removed if required or kept if optional
    },
    companySealUrl: {
        type: String,
        default: 'N/A' // Default can be removed if required or kept if optional
    },

    // --- Tax Details ---
    taxId: {
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
    ifsc: {
        type: String,
        trim: true,
    },
    upiId: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true 
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;
