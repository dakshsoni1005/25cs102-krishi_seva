import api from "./api";

export const getRecommendations = async (params = {}) => {
  const response = await api.post("/smart-krishi/recommendations", params);
  return response.data.data || response.data;
};

export const getCrops = async () => {
  const response = await api.get("/smart-krishi/crops");
  return response.data.data || response.data;
};

export const getDistricts = async () => {
  const response = await api.get("/smart-krishi/districts");
  return response.data.data || response.data;
};

export const getCropsByDistrict = async (district) => {
  const response = await api.get(`/smart-krishi/crops/by-district/${encodeURIComponent(district)}`);
  return response.data.data || response.data;
};

export const smartKrishiService = {
  getRecommendations,
  getCrops,
  getDistricts,
  getCropsByDistrict,

  getSoil: async (district) => {
    const response = await api.get(`/smart-krishi/soil/${encodeURIComponent(district)}`);
    return response.data.data || response.data;
  },

  getFertilizers: async (crop) => {
    const response = await api.get(`/smart-krishi/fertilizers/${encodeURIComponent(crop)}`);
    return response.data.data || response.data;
  },

  getIrrigation: async (crop) => {
    const response = await api.get(`/smart-krishi/irrigation/${encodeURIComponent(crop)}`);
    return response.data.data || response.data;
  },

  getDiseases: async (crop) => {
    const response = await api.get(`/smart-krishi/diseases/${encodeURIComponent(crop)}`);
    return response.data.data || response.data;
  },

  getPests: async (crop) => {
    const response = await api.get(`/smart-krishi/pests/${encodeURIComponent(crop)}`);
    return response.data.data || response.data;
  },

  getCropCalendar: async (crop) => {
    const response = await api.get(`/smart-krishi/crop-calendar/${encodeURIComponent(crop)}`);
    return response.data.data || response.data;
  },

  getWeather: async (district) => {
    const response = await api.get(`/smart-krishi/weather/${encodeURIComponent(district)}`);
    return response.data.data || response.data;
  },

  getMarketPrices: async (crop) => {
    const response = await api.get(`/smart-krishi/market-prices/${encodeURIComponent(crop)}`);
    return response.data.data || response.data;
  },

  getGovernmentAdvisories: async () => {
    const response = await api.get("/smart-krishi/government-advisories");
    return response.data.data || response.data;
  }
};

export default smartKrishiService;
