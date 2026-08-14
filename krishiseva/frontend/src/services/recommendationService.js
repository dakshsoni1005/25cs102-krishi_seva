import api from "./api";

export const recommendationService = {
  getRecommendations: async () => {
    const response = await api.get("/smart-krishi/recommendations");
    return response.data.data.recommendations;
  },

  getRecommendationsByCategory: async (category) => {
    const list = await recommendationService.getRecommendations();
    return list.filter((r) => r.category.toLowerCase() === category.toLowerCase());
  },

  getRecommendationsByPriority: async (priority) => {
    const list = await recommendationService.getRecommendations();
    return list.filter((r) => r.priority.toLowerCase() === priority.toLowerCase());
  }
};

export default recommendationService;
