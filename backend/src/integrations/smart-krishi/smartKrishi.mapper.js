const buildSmartKrishiPayload = (farmerProfile, requestBody = {}) => {
  const district = requestBody.district || (farmerProfile ? farmerProfile.district : "Rajkot") || "Rajkot";
  const crop = requestBody.crop || (farmerProfile ? farmerProfile.mainCrop : "Cotton") || "Cotton";
  const season = requestBody.season || "Kharif";

  return {
    district: district.trim(),
    crop: crop.trim(),
    season: season.trim()
  };
};

const normalizeSmartKrishiResponse = (rawResponse) => {
  if (!rawResponse) {
    return {
      source: "smart_krishi",
      recommendations: [],
      weather: {},
      soil: {},
      fertilizer: {},
      irrigation: {},
      disease: [],
      pests: [],
      cropCalendar: {},
      market: {},
      governmentAdvisories: []
    };
  }

  // Handle case where rawResponse is already structured or wrapped in data property
  const payload = rawResponse.data || rawResponse;

  // Extract recommendations array if available
  let recsList = [];
  if (Array.isArray(payload.recommendations)) {
    recsList = payload.recommendations;
  } else if (Array.isArray(payload.advisory)) {
    recsList = payload.advisory;
  } else if (Array.isArray(payload)) {
    recsList = payload;
  }

  // Format recommendations items cleanly for KrishiSeva UI
  const formattedRecs = recsList.map((r, idx) => {
    if (typeof r === "string") {
      return {
        id: `sk-rec-${idx}`,
        category: "General",
        priority: "MEDIUM",
        title: "Agronomy Advisory",
        explanation: r,
        reason: "Smart Krishi AI rule engine output.",
        action: "Follow advised agricultural steps.",
        benefit: r,
        timestamp: new Date()
      };
    }

    const catDisplay = r.category || r.type || "General";
    return {
      id: r.id || r._id ? (r.id || r._id).toString() : `sk-rec-${idx}`,
      category: catDisplay.charAt(0).toUpperCase() + catDisplay.slice(1),
      priority: r.priority ? r.priority.toUpperCase() : "MEDIUM",
      title: r.title || "Smart Krishi Recommendation",
      explanation: r.explanation || r.description || r.message || "",
      reason: r.reason || "Smart Krishi rule evaluation.",
      action: r.action || "Execute recommended steps.",
      benefit: r.benefit || r.explanation || r.description || "",
      timestamp: r.timestamp || r.createdAt || new Date()
    };
  });

  return {
    source: "smart_krishi",
    recommendations: formattedRecs,
    weather: payload.weather || {},
    soil: payload.soil || {},
    fertilizer: payload.fertilizer || {},
    irrigation: payload.irrigation || {},
    disease: payload.disease || payload.diseases || [],
    pests: payload.pests || [],
    cropCalendar: payload.cropCalendar || {},
    market: payload.market || payload.marketPrices || {},
    governmentAdvisories: payload.governmentAdvisories || payload.advisories || []
  };
};

module.exports = {
  buildSmartKrishiPayload,
  normalizeSmartKrishiResponse
};
