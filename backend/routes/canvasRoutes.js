const express = require("express");
const router = express.Router();

const {
  createCanvas,
  getCanvas,
  updateCanvasTitle,
  updateCanvasContent,
  deleteCanvas,
} = require("../controllers/canvasController");

router.post("/create", createCanvas);

router.get("/:canvasId", getCanvas);

router.patch("/title/:canvasId", updateCanvasTitle);

router.patch("/content/:canvasId", updateCanvasContent);

router.delete("/:sectionId/:canvasId", deleteCanvas);

module.exports = router;
