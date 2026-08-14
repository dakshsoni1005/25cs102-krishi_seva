import api from "./api";

export const farmService = {
  getFarms: async () => {
    const response = await api.get("/farms");
    return response.data.data.farms || [];
  },

  createFarm: async (farmData) => {
    const response = await api.post("/farms", farmData);
    return response.data.data;
  },

  deleteFarm: async (id) => {
    const response = await api.delete(`/farms/${id}`);
    return response.data.data;
  }
};
