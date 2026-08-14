const axios = require("axios");
const env = require("../../config/env");
const logger = require("../../utils/logger");

const createClient = () => {
  const baseURL = env.SMART_KRISHI_API_URL || "http://localhost:5001";
  const timeout = env.SMART_KRISHI_TIMEOUT_MS || 15000;
  
  const headers = {
    "Content-Type": "application/json"
  };

  if (env.SMART_KRISHI_API_KEY) {
    headers["x-api-key"] = env.SMART_KRISHI_API_KEY;
  }

  return axios.create({
    baseURL,
    timeout,
    headers
  });
};

const handleClientError = (error, actionName) => {
  logger.error(`Smart Krishi Integration Error during [${actionName}]: ${error.message}`);
  
  const err = new Error("Smart Krishi service is temporarily unavailable.");
  err.statusCode = error.response ? error.response.status : 503;
  err.code = "SMART_KRISHI_UNAVAILABLE";
  throw err;
};

const checkHealth = async () => {
  const client = createClient();
  try {
    const response = await client.get("/health");
    return response.data;
  } catch (error) {
    try {
      // Fallback try /api/health if root /health not present
      const fallbackRes = await client.get("/api/health");
      return fallbackRes.data;
    } catch (fbErr) {
      handleClientError(error, "checkHealth");
    }
  }
};

const postRecommendations = async (payload) => {
  const client = createClient();
  try {
    const response = await client.post("/api/recommendations", payload);
    return response.data;
  } catch (error) {
    handleClientError(error, "postRecommendations");
  }
};

const getCrops = async () => {
  const client = createClient();
  try {
    const response = await client.get("/api/crops");
    return response.data;
  } catch (error) {
    handleClientError(error, "getCrops");
  }
};

const getDistricts = async () => {
  const client = createClient();
  try {
    const response = await client.get("/api/districts");
    return response.data;
  } catch (error) {
    handleClientError(error, "getDistricts");
  }
};

const getSoil = async (district) => {
  const client = createClient();
  try {
    const response = await client.get(`/api/soil/${encodeURIComponent(district)}`);
    return response.data;
  } catch (error) {
    handleClientError(error, "getSoil");
  }
};

const getFertilizers = async (crop) => {
  const client = createClient();
  try {
    const response = await client.get(`/api/fertilizers/${encodeURIComponent(crop)}`);
    return response.data;
  } catch (error) {
    handleClientError(error, "getFertilizers");
  }
};

const getIrrigation = async (crop) => {
  const client = createClient();
  try {
    const response = await client.get(`/api/irrigation/${encodeURIComponent(crop)}`);
    return response.data;
  } catch (error) {
    handleClientError(error, "getIrrigation");
  }
};

const getDiseases = async (crop) => {
  const client = createClient();
  try {
    const response = await client.get(`/api/diseases/${encodeURIComponent(crop)}`);
    return response.data;
  } catch (error) {
    handleClientError(error, "getDiseases");
  }
};

const getPests = async (crop) => {
  const client = createClient();
  try {
    const response = await client.get(`/api/pests/${encodeURIComponent(crop)}`);
    return response.data;
  } catch (error) {
    handleClientError(error, "getPests");
  }
};

const getCropCalendar = async (crop) => {
  const client = createClient();
  try {
    const response = await client.get(`/api/crop-calendar/${encodeURIComponent(crop)}`);
    return response.data;
  } catch (error) {
    handleClientError(error, "getCropCalendar");
  }
};

const getWeather = async (district) => {
  const client = createClient();
  try {
    const response = await client.get(`/api/weather/${encodeURIComponent(district)}`);
    return response.data;
  } catch (error) {
    handleClientError(error, "getWeather");
  }
};

const getMarketPrices = async (crop) => {
  const client = createClient();
  try {
    const response = await client.get(`/api/market-prices/${encodeURIComponent(crop)}`);
    return response.data;
  } catch (error) {
    handleClientError(error, "getMarketPrices");
  }
};

const getGovernmentAdvisories = async () => {
  const client = createClient();
  try {
    const response = await client.get("/api/government-advisories");
    return response.data;
  } catch (error) {
    handleClientError(error, "getGovernmentAdvisories");
  }
};

module.exports = {
  checkHealth,
  postRecommendations,
  getCrops,
  getDistricts,
  getSoil,
  getFertilizers,
  getIrrigation,
  getDiseases,
  getPests,
  getCropCalendar,
  getWeather,
  getMarketPrices,
  getGovernmentAdvisories
};
