import api from "./api";

export const schemeService = {
  getSchemes: async (filters = {}) => {
    // Pass filters state (benefitType, crop, etc.) to backend schemes endpoint
    const response = await api.get("/schemes", { params: filters });
    return response.data.data.schemes;
  },

  checkEligibility: async (farmer, schemeId) => {
    const response = await api.post(`/schemes/${schemeId}/check-eligibility`);
    return response.data.data;
  },

  getBenefitTypesList: () => {
    return [
      "Direct Income Support",
      "Crop Insurance",
      "Subsidies & Equipment",
      "Irrigation Support"
    ];
  }
};

export default schemeService;
