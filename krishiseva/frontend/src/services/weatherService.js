import api from "./api";

export const weatherService = {
  getWeatherData: async (state, district, taluka, village) => {
    // Backend weather client parses coordinates based on farmer session
    const response = await api.get("/weather");
    return response.data.data;
  },
  
  getWeatherAlerts: async () => {
    const response = await api.get("/weather/alerts");
    return response.data.data.alerts;
  }
};

export default weatherService;
