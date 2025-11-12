
const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoices
} = require("../controllers/invoice3Controller");

router.post("/", createInvoice);
router.get("/", getInvoices);

module.exports = router;
