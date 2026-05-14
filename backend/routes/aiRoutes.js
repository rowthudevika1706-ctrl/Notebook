const express = require("express");
const router = express.Router();
const {
  generateAiNote,
  generateCanvasDrawing,
} = require("../controllers/AIControllers");

router.post("/generate-ai-note", generateAiNote);

router.post("/generate-canvas-drawing", generateCanvasDrawing);

module.exports = router;
