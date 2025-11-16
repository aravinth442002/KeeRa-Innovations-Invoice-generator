const express = require("express");
const router = express.Router();
const descriptionController = require("../controllers/descriptionController");

router.post("/", descriptionController.createDescription);
router.get("/", descriptionController.getDescriptions);
router.get("/:id", descriptionController.getDescriptionById);
router.put("/:id", descriptionController.updateDescription);
router.delete("/:id", descriptionController.deleteDescription);

module.exports = router;
