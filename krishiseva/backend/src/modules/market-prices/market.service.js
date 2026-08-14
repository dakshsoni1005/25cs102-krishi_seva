const MarketPrice = require("../../database/models/MarketPrice");
const MarketWatchlist = require("../../database/models/MarketWatchlist");

const getMarketPrices = async (filters = {}) => {
  const { search, crop, district, sortBy } = filters;
  
  const query = {};
  
  if (search) {
    query.$or = [
      { cropName: { $regex: search, $options: "i" } },
      { market: { $regex: search, $options: "i" } },
      { district: { $regex: search, $options: "i" } }
    ];
  }

  if (crop) {
    query.cropName = { $regex: `^${crop}$`, $options: "i" };
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
      prices.sort({ cropName: 1 });
    }
  }

  const results = await prices.lean();
  
  return results.map((r) => ({
    id: r._id.toString(),
    crop: r.cropName,
    cropName: r.cropName,
    market: r.market,
    district: r.district,
    state: r.state || "Gujarat",
    location: `${r.district}, ${r.state || "Gujarat"}`,
    minPrice: r.minPrice,
    maxPrice: r.maxPrice,
    avgPrice: r.modalPrice,
    modalPrice: r.modalPrice,
    unit: r.unit || "quintal",
    currency: "INR",
    lastUpdated: r.date ? new Date(r.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    trend: r.trend || "stable",
    source: r.source || "APMC Market Feed",
    isLive: Boolean(r.isLive)
  }));
};

const getPriceTrends = async (cropName) => {
  if (!cropName) return [];

  // Query database for historical market records for target crop
  const records = await MarketPrice.find({
    cropName: { $regex: `^${cropName}$`, $options: "i" }
  })
    .sort({ date: 1 })
    .limit(6)
    .lean();

  if (!records || records.length === 0) {
    return [];
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return records.map((r) => {
    const d = r.date ? new Date(r.date) : new Date();
    return {
      month: months[d.getMonth()],
      price: r.modalPrice
    };
  });
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
