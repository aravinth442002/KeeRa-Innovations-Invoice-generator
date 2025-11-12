
const express = require("express");
const router = express.Router();
const {
  createDescription,
  getDescriptions,
} = require("../controllers/descriptionController");

router.post("/", createDescription);
router.get("/", getDescriptions);

module.exports = router;
