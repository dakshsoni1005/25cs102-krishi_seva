const axios = require("axios");
const env = require("../../config/env");
const logger = require("../../utils/logger");

const generateChatResponse = async (prompt, systemInstruction = "") => {
  const apiKey = env.GEMINI_API_KEY;
  const modelName = env.GEMINI_MODEL || "gemini-1.5-flash";

  if (!apiKey) {
    logger.warn("GEMINI_API_KEY is not configured on backend.");
    const err = new Error("AI service is currently unavailable.");
    err.statusCode = 503;
    err.code = "AI_SERVICE_UNAVAILABLE";
    throw err;
  }

  const startTime = Date.now();
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemInstruction ? `${systemInstruction}\n\nUser Question: ${prompt}` : prompt }]
        }
      ]
    };

    const response = await axios.post(url, requestBody, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000 // 10 second timeout constraint
    });

    const latency = Date.now() - startTime;
    logger.info(`Gemini API Response received (${modelName}) in ${latency}ms`);

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts
    ) {
      return response.data.candidates[0].content.parts[0].text;
    }

    throw new Error("Invalid response schema returned by Gemini endpoint.");
  } catch (error) {
    const latency = Date.now() - startTime;
    logger.error(`Gemini API Request Failed (${modelName}, ${latency}ms): ${error.message}`);
    
    const err = new Error("AI service is currently unavailable.");
    err.statusCode = 503;
    err.code = "AI_SERVICE_UNAVAILABLE";
    throw err;
  }
};

module.exports = {
  generateChatResponse
};
