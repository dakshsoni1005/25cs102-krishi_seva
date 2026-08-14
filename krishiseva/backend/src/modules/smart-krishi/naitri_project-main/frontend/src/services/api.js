import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000 // 12 seconds timeout to allow for Gemini/Weather calls
});

export const getDistricts = async () => {
  const response = await api.get('/districts');
  return response.data;
};

export const getCrops = async () => {
  const response = await api.get('/crops');
  return response.data;
};

export const getCropsByDistrict = async (district) => {
  const response = await api.get(`/crops/by-district/${encodeURIComponent(district)}`);
  return response.data;
};

export const getSoilData = async (district) => {
  const response = await api.get(`/soil/${encodeURIComponent(district)}`);
  return response.data;
};

export const getWeather = async (district) => {
  const response = await api.get(`/weather/${encodeURIComponent(district)}`);
  return response.data;
};

export const getMarketPrices = async (crop) => {
  const response = await api.get(`/market-prices/${encodeURIComponent(crop)}`);
  return response.data;
};

export const getAdvisories = async (district = '') => {
  const url = district ? `/government-advisories?district=${encodeURIComponent(district)}` : '/government-advisories';
  const response = await api.get(url);
  return response.data;
};

export const getRecommendations = async (params) => {
  const response = await api.post('/recommendations', params);
  return response.data;
};

export default api;
