const express = require('express');
const router = express.Router();
const path = require('path'); 
const multer = require('multer'); 
const companyController = require('../controllers/companyController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.route('/')
    .get(companyController.getAllCompanies)
    .post(
        upload.fields([
            { name: 'companyLogoUrl', maxCount: 1 },
            { name: 'companySignatureUrl', maxCount: 1 },
            { name: 'companySealUrl', maxCount: 1 },
            { name: 'companyLogo', maxCount: 1 }

        ]),
        companyController.createCompany 
    );

router.route('/:id')
    .get(companyController.getCompanyById)
    .put(
        upload.fields([
            { name: 'companyLogoUrl', maxCount: 1 },
            { name: 'companySignatureUrl', maxCount: 1 },
            { name: 'companySealUrl', maxCount: 1 },
            { name: 'companyLogo', maxCount: 1 }
        ]),
        companyController.updateCompany
    )
    .delete(companyController.deleteCompany);

module.exports = router;
