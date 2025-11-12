
const express = require("express");
const router = express.Router();
const {
  getSellerInfo,
  updateSellerInfo
} = require("../controllers/sellerController");

router.get("/", getSellerInfo);
router.put("/", updateSellerInfo);

module.exports = router;
