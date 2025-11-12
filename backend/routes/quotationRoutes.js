const express = require("express");
const router = express.Router();
const {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation
} = require("../controllers/quotationController");

router.post("/", createQuotation);
router.get("/", getQuotations);
router.get("/:id", getQuotationById);
router.put("/:id", updateQuotation);
router.delete("/:id", deleteQuotation);

module.exports = router;
