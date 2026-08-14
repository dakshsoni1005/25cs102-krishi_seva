import api from "./api";

export const marketService = {
  getMarketPrices: async (filters = {}) => {
    const response = await api.get("/market", { params: filters });
    return response.data.data.prices;
  },

  getPriceTrends: async (crop) => {
    const response = await api.get("/market/trends", { params: { crop } });
    return response.data.data.trends;
  },

  getCropsList: () => {
    return ["Cotton", "Groundnut", "Wheat", "Castor", "Bajra", "Paddy", "Mustard", "Sesame"];
  },

  getDistrictsList: () => {
    return ["Rajkot", "Anand", "Ahmedabad", "Patan", "Mehsana", "Banaskantha"];
  },

  getWatchlist: async () => {
    const response = await api.get("/market/watchlist");
    return response.data.data.watchlist;
  },

  toggleWatchlist: async (marketPriceId) => {
    const response = await api.post("/market/watchlist", { marketPriceId });
    return response.data.data.watchlist;
  }
};

export default marketService;
