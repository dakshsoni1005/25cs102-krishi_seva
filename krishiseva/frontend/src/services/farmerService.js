import api from "./api";

export const farmerService = {
  getProfile: async () => {
    const response = await api.get("/farmers/profile");
    return response.data.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/farmers/profile", profileData);
    return response.data.data;
  }
};
