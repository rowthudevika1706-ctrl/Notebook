const express = require("express");
const router = express.Router();
const {
  createSection,
  getSections,
  deleteSection,
  renameSection,
} = require("../controllers/sectionController");

router.post("/create", createSection);

router.get("/", getSections);

router.delete("/:sectionId", deleteSection);

router.patch("/rename/:sectionId", renameSection);

module.exports = router;
