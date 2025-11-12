
const express = require("express");
const router = express.Router();
const {
  createDescription,
  getDescriptions,
  updateDescription,
  deleteDescription,
} = require("../controllers/descriptionController");

router.post("/", createDescription);
router.get("/", getDescriptions);
router.put("/:id", updateDescription);
router.delete("/:id", deleteDescription);

module.exports = router;
