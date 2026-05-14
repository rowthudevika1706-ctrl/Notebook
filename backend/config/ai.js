require("dotenv").config();
const OpenAI = require("openai");

const openAI = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.FRONTEND_URL,
    "X-Title": "Notebook AI Assistant",
  },
});

const getAIResponse = async (userMessage, systemRules) => {
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const temperature = 0.7;

  // console.log(userMessage, systemRules);

  try {
    const response = await openAI.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemRules || "" },
        { role: "user", content: userMessage },
      ],
      temperature,
    });

    // console.log(response);

    let message = response?.choices?.[0]?.message?.content;

    if (message && message.includes("```json")) {
      message.replace(/```json|```/g, "").trim();
    }

    message = await JSON.parse(message);
    // console.log(message);

    return message;
  } catch (err) {
    console.error("getAIResponse error:", err?.message || err);
    return null;
  }
};

module.exports = {
  getAIResponse,
};
