const axios = require("axios");
const env = require("../../config/env");
const logger = require("../../utils/logger");

// Local Keyword-based QA mock provider as fallback
const mockResponses = [
  {
    keywords: ["fertilizer", "urea", "dap"],
    response: `For Bt Cotton during the vegetative phase:
1. **Nitrogen:** Apply Urea @ 50 kg/acre as top dressing on moist soil.
2. **NPK:** Apply NPK (12:32:16) @ 75 kg/acre or DAP @ 50 kg/acre if not done during sowing.
3. **Micro-nutrients:** Add Magnesium Sulphate @ 15 kg/acre to prevent red leaf chlorosis.`
  },
  {
    keywords: ["rain", "weather", "forecast"],
    response: `Weather model forecast indicates high precipitation chances tomorrow (85%+ probability).
- Actions: Delay active irrigation and pesticide spraying. Maintain field drainage channels.`
  },
  {
    keywords: ["yellow", "leaf", "leaves"],
    response: `Leaf yellowing is usually due to:
1. Nitrogen Deficiency: Pale color on old bottom leaves first. Apply Urea.
2. Iron Deficiency: Interveinal chlorosis on new leaves. Spray Ferrous Sulphate @ 5g/L.
3. Pest Activity: Curled yellowing leaves. Perform an **AI Pest Scan**.`
  }
];

const generateChatResponse = async (prompt, systemInstruction = "") => {
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    logger.warn("GEMINI_API_KEY is missing. Using local mock advisor response.");
    
    // Search keyword maps
    const promptLower = prompt.toLowerCase();
    const match = mockResponses.find((item) =>
      item.keywords.some((kw) => promptLower.includes(kw))
    );

    if (match) return match.response;

    return `Hello! I am your Krishi AI Guru. I detected your query: "${prompt}".

Since Gemini is currently running in Demo Mock Mode, please try asking about:
- "fertilizer scheduling"
- "yellow leaves"
- "upcoming rain warnings"`;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${prompt}` }]
        }
      ]
    };

    const response = await axios.post(url, requestBody, {
      headers: { "Content-Type": "application/json" }
    });

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts
    ) {
      return response.data.candidates[0].content.parts[0].text;
    }

    throw new Error("Invalid response format received from Gemini endpoint.");
  } catch (error) {
    logger.error(`Gemini API Call Failed: ${error.message}`);
    return `Hello. I had trouble connecting to the AI brain. However, as a rule of thumb, please ensure you check weather forecasts before spraying, and perform a soil test to confirm NPK indexes.`;
  }
};

module.exports = {
  generateChatResponse
};
