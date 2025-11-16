const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");

router.post("/", sellerController.createSeller);
router.get("/", sellerController.getSellers);
router.get("/:id", sellerController.getSellerById);
router.put("/:id", sellerController.updateSeller);
router.delete("/:id", sellerController.deleteSeller);

module.exports = router;
