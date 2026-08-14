import api from "./api";

export const smartKrishiService = {
  getRecommendations: async (params = {}) => {
    const response = await api.post("/smart-krishi/recommendations", params);
    return response.data.data;
  },

  getCrops: async () => {
    const response = await api.get("/smart-krishi/crops");
    return response.data.data;
  },

  getDistricts: async () => {
    const response = await api.get("/smart-krishi/districts");
    return response.data.data;
  },

  getSoil: async (district) => {
    const response = await api.get(`/smart-krishi/soil/${encodeURIComponent(district)}`);
    return response.data.data;
  },

  getFertilizers: async (crop) => {
    const response = await api.get(`/smart-krishi/fertilizers/${encodeURIComponent(crop)}`);
    return response.data.data;
  },

  getIrrigation: async (crop) => {
    const response = await api.get(`/smart-krishi/irrigation/${encodeURIComponent(crop)}`);
    return response.data.data;
  },

  getDiseases: async (crop) => {
    const response = await api.get(`/smart-krishi/diseases/${encodeURIComponent(crop)}`);
    return response.data.data;
  },

  getPests: async (crop) => {
    const response = await api.get(`/smart-krishi/pests/${encodeURIComponent(crop)}`);
    return response.data.data;
  },

  getCropCalendar: async (crop) => {
    const response = await api.get(`/smart-krishi/crop-calendar/${encodeURIComponent(crop)}`);
    return response.data.data;
  },

  getWeather: async (district) => {
    const response = await api.get(`/smart-krishi/weather/${encodeURIComponent(district)}`);
    return response.data.data;
  },

  getMarketPrices: async (crop) => {
    const response = await api.get(`/smart-krishi/market-prices/${encodeURIComponent(crop)}`);
    return response.data.data;
  },

  getGovernmentAdvisories: async () => {
    const response = await api.get("/smart-krishi/government-advisories");
    return response.data.data;
  }
};
