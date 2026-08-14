const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Gemini API key is missing from environment variables.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

module.exports = genAI;
