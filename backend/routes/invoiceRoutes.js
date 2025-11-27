const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.post("/", invoiceController.createInvoice);
router.get("/", invoiceController.getInvoices);
router.get("/:id", invoiceController.getInvoiceById);
router.put("/:id", invoiceController.updateInvoice);
router.delete("/:id", invoiceController.deleteInvoice);

router.get("/:id/pdf", invoiceController.generateInvoicePDF);

module.exports = router;
