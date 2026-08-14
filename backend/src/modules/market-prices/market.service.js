const MarketPrice = require("../../database/models/MarketPrice");
const MarketWatchlist = require("../../database/models/MarketWatchlist");

const getMarketPrices = async (filters = {}) => {
  const { search, crop, district, sortBy } = filters;
  
  const query = {};
  
  if (search) {
    query.$or = [
      { crop: { $regex: search, $options: "i" } },
      { market: { $regex: search, $options: "i" } },
      { district: { $regex: search, $options: "i" } }
    ];
  }

  if (crop) {
    query.crop = { $regex: `^${crop}$`, $options: "i" };
  }

  if (district) {
    query.district = { $regex: `^${district}$`, $options: "i" };
  }

  const prices = MarketPrice.find(query);

  if (sortBy) {
    if (sortBy === "price_desc") {
      prices.sort({ modalPrice: -1 });
    } else if (sortBy === "price_asc") {
      prices.sort({ modalPrice: 1 });
    } else if (sortBy === "crop") {
      prices.sort({ crop: 1 });
    }
  }

  const results = await prices.lean();
  
  // Format results for frontend service compatibility
  return results.map((r) => ({
    id: r._id.toString(),
    crop: r.crop,
    market: r.market,
    location: `${r.district}, ${r.state}`,
    minPrice: r.minPrice,
    maxPrice: r.maxPrice,
    avgPrice: r.modalPrice,
    lastUpdated: r.date.toISOString().split("T")[0],
    trend: r.trend
  }));
};

const getPriceTrends = async (cropName) => {
  // Return static 6-month historical database matching the frontend mock trends
  const mockPriceTrends = {
    "Cotton": [
      { month: "Mar", price: 6800 },
      { month: "Apr", price: 6950 },
      { month: "May", price: 7100 },
      { month: "Jun", price: 7050 },
      { month: "Jul", price: 7150 },
      { month: "Aug", price: 7200 }
    ],
    "Groundnut": [
      { month: "Mar", price: 6900 },
      { month: "Apr", price: 6850 },
      { month: "May", price: 6800 },
      { month: "Jun", price: 6720 },
      { month: "Jul", price: 6700 },
      { month: "Aug", price: 6650 }
    ],
    "Wheat": [
      { month: "Mar", price: 2300 },
      { month: "Apr", price: 2420 },
      { month: "May", price: 2500 },
      { month: "Jun", price: 2550 },
      { month: "Jul", price: 2600 },
      { month: "Aug", price: 2625 }
    ],
    "Castor": [
      { month: "Mar", price: 6400 },
      { month: "Apr", price: 6300 },
      { month: "May", price: 6250 },
      { month: "Jun", price: 6200 },
      { month: "Jul", price: 6150 },
      { month: "Aug", price: 6100 }
    ]
  };

  return mockPriceTrends[cropName] || mockPriceTrends["Cotton"];
};

const getWatchlistKeys = async (farmerId) => {
  const list = await MarketWatchlist.find({ farmerId });
  const keys = [];
  for (const item of list) {
    const priceDoc = await MarketPrice.findOne({ cropName: item.cropName, market: item.market }).sort({ date: -1 });
    if (priceDoc) keys.push(priceDoc._id.toString());
  }
  return keys;
};

const toggleWatchlist = async (farmerId, marketPriceId) => {
  const priceDoc = await MarketPrice.findById(marketPriceId);
  if (!priceDoc) {
    const err = new Error("Market item not found.");
    err.statusCode = 404;
    throw err;
  }

  const existing = await MarketWatchlist.findOne({
    farmerId,
    cropName: priceDoc.cropName,
    market: priceDoc.market
  });

  if (existing) {
    await MarketWatchlist.findByIdAndDelete(existing._id);
  } else {
    await MarketWatchlist.create({
      farmerId,
      cropId: priceDoc.crop,
      cropName: priceDoc.cropName,
      market: priceDoc.market
    });
  }
  return await getWatchlistKeys(farmerId);
};

module.exports = {
  getMarketPrices,
  getPriceTrends,
  getWatchlistKeys,
  toggleWatchlist
};
