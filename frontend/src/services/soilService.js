import api from "./api";

export const soilService = {
  getSoilData: async (farmerId) => {
    const response = await api.get("/soil");
    return response.data.data;
  },

  getSoilByRegion: async (regionName) => {
    const response = await api.get(`/soil/region/${regionName}`);
    return response.data.data;
  },

  retestSoil: async (regionName) => {
    const response = await api.post("/soil/retest", { region: regionName });
    return response.data.data;
  }
};

export default soilService;
