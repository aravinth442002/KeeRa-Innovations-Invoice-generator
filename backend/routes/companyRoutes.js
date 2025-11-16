// routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Base path: /api/companies

// GET all companies (Read All) and POST a new company (Create)
router.route('/')
    .get(companyController.getAllCompanies)
    .post(companyController.createCompany);

// GET one company (Read One), PUT to update (Update), and DELETE one company (Delete)
router.route('/:id')
    .get(companyController.getCompanyById)
    .put(companyController.updateCompany)
    .delete(companyController.deleteCompany);

module.exports = router;