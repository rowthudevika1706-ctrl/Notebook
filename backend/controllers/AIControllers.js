const { NOTE_GENERATION_RULES, CANVAS_GENERATION_RULES } = require("../utils");

const { getAIResponse } = require("../config/ai");

const generateAiNote = async (req, res) => {
  try {
    const { prompt, noteContent } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res
        .status(400)
        .json({ message: "Prompt is required and must be a string." });
    }
    // console.log(prompt, noteContent);

    const userMessage = `User request:"${prompt}" and note content:"${noteContent}"`;

    const response = await getAIResponse(userMessage, NOTE_GENERATION_RULES);
    return res.status(200).json({ message: response, status: true });
  } catch (err) {
    console.error("generateAiNote error:", err?.message || err);
    res
      .status(500)
      .json({ message: err.message || "AI note generation failed." });
  }
};

const generateCanvasDrawing = async (req, res) => {
  try {
    const { prompt, width = 1000, height = 562 } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res
        .status(400)
        .json({ message: "prompt is required and must be a string." });
    }

    const userMessage = `
            Canvas meta: width=${width}, height=${height}
            User request: ${prompt}
            `;

    const response = await getAIResponse(userMessage, CANVAS_GENERATION_RULES);
    return res.status(200).json({ canvas: response, status: true });
  } catch (err) {
    console.error("generateCanvasDrawing error:", err?.message || err);
    res
      .status(500)
      .json({ message: err.message || "Canvas drawing generation failed." });
  }
};

module.exports = {
  generateAiNote,
  generateCanvasDrawing,
};
