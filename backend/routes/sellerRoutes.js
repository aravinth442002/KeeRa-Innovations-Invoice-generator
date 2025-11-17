const express = require("express");
const {
  getSellers,
  getSeller,
  createSeller,
  updateSeller,
  deleteSeller,
} = require("../controllers/sellerController"); 

const router = express.Router();

router.route("/")
  .get(getSellers)
  .post(createSeller);

router.route("/:id")
  .get(getSeller)
  .put(updateSeller)
  .delete(deleteSeller);

module.exports = router;