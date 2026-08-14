const axios = require("axios");
const env = require("../../config/env");
const logger = require("../../utils/logger");

// Local Keyword-based QA mock provider as fallback when API key is missing or service is offline
const fallbackResponses = [
  {
    keywords: ["fertilizer", "urea", "dap", "npk"],
    response: `For Bt Cotton during the vegetative growth phase:
1. **Nitrogen:** Apply Urea @ 50 kg/acre as top dressing on moist soil.
2. **NPK:** Apply NPK (12:32:16) @ 75 kg/acre or DAP @ 50 kg/acre if not done during sowing.
3. **Micro-nutrients:** Add Magnesium Sulphate @ 15 kg/acre to prevent red leaf chlorosis.`
  },
  {
    keywords: ["rain", "weather", "forecast", "irrigation"],
    response: `Weather forecast indicates precipitation probability in your region.
- **Action Plan:** Delay active surface/drip irrigation cycles for 24-48 hours. Clear drainage channels to avoid waterlogging near roots.`
  },
  {
    keywords: ["yellow", "leaf", "leaves", "pest"],
    response: `Leaf yellowing is usually caused by:
1. **Nitrogen Deficiency:** Pale yellowing starting from bottom leaves. Apply Urea top dressing.
2. **Iron Deficiency:** Interveinal chlorosis on new leaves. Spray Ferrous Sulphate @ 5g/L.
3. **Sucking Pests:** Leaf curling and yellowing. Perform a leaf scan with our **AI Pest Scanner**.`
  }
];

const generateChatResponse = async (prompt, systemInstruction = "") => {
  const apiKey = env.GEMINI_API_KEY;
  const modelName = env.GEMINI_MODEL || "gemini-1.5-flash";

  if (!apiKey) {
    logger.warn("GEMINI_API_KEY is not configured. Falling back to agronomy rule response.");
    return getFallbackResponse(prompt);
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
    return getFallbackResponse(prompt);
  }
};

const getFallbackResponse = (prompt) => {
  const promptLower = prompt.toLowerCase();
  const match = fallbackResponses.find((item) =>
    item.keywords.some((kw) => promptLower.includes(kw))
  );

  if (match) return match.response;

  return `Thank you for your question. Based on standard agricultural guidelines for Gujarat farming regions:
1. Inspect soil moisture before scheduling irrigation.
2. Apply balanced NPK fertilizers according to your soil health advisory card.
3. If you suspect pest damage, take a leaf photo using the **AI Pest Scanner** module for automated disease diagnosis.

*(Note: For complex or unusual crop symptoms, please consult your local Agricultural Extension Officer).*`;
};

module.exports = {
  generateChatResponse
};
