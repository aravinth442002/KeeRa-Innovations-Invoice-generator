const express = require('express');
const router = express.Router();
const path = require('path'); 
const multer = require('multer'); 
const companyController = require('../controllers/companyController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // IMPORTANT: Ensure this 'uploads/' directory exists in your project root
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Example filename: companySignatureUrl-1763784000000.png
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload middleware
const upload = multer({ storage: storage });

router.route('/')
    .get(companyController.getAllCompanies)
    // ⬅️ Use upload.fields() for files and text data
    .post(
        // Middleware handles two specific file fields
        upload.fields([
            { name: 'companySignatureUrl', maxCount: 1 },
            { name: 'companySealUrl', maxCount: 1 }
        ]),
        companyController.createCompany 
    );

router.route('/:id')
    .get(companyController.getCompanyById)
    // NOTE: You might need a similar Multer setup for the .put route if it also updates files
    .put(companyController.updateCompany)
    .delete(companyController.deleteCompany);

module.exports = router;