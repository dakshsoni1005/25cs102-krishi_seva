const FarmerProfile = require("../../database/models/FarmerProfile");
const AIRecommendation = require("../../database/models/AIRecommendation");
const smartKrishiClient = require("./smartKrishi.client");
const { buildSmartKrishiPayload, normalizeSmartKrishiResponse } = require("./smartKrishi.mapper");
const { validateRecommendationRequest } = require("./smartKrishi.validation");
const logger = require("../../utils/logger");

const getRecommendations = async (farmerId, bodyParams = {}) => {
  logger.info(`Executing Smart Krishi Integration Pipeline for farmerId: ${farmerId}`);

  // 1. Fetch authenticated farmer context
  const profile = await FarmerProfile.findOne({ userId: farmerId });

  // 2. Build payload { district, crop, season }
  const payload = buildSmartKrishiPayload(profile, bodyParams);

  // 3. Validate request format
  const validation = validateRecommendationRequest(payload);
  if (!validation.isValid) {
    const err = new Error(`Validation Error: ${validation.errors.join(" ")}`);
    err.statusCode = 400;
    err.code = "INVALID_RECOMMENDATION_REQUEST";
    throw err;
  }

  // 4. Send request to Smart Krishi backend server
  const rawResponse = await smartKrishiClient.postRecommendations(payload);

  // 5. Normalize response shape
  const normalized = normalizeSmartKrishiResponse(rawResponse);

  // 6. Save normalized recommendation history if recommendations exist
  if (normalized.recommendations.length > 0) {
    try {
      // Clear previous recommendations for this farmer
      await AIRecommendation.deleteMany({ farmerId });

      const newRecs = normalized.recommendations.map((r) => ({
        farmerId,
        type: r.category ? r.category.toLowerCase() : "general",
        priority: r.priority ? r.priority.toLowerCase() : "medium",
        title: r.title,
        description: r.explanation,
        reason: r.reason,
        action: r.action,
        source: "smart_krishi",
        metadata: {
          benefit: r.benefit
        }
      }));

      await AIRecommendation.create(newRecs);
    } catch (saveErr) {
      logger.error(`Failed to store normalized Smart Krishi recommendations: ${saveErr.message}`);
    }
  }

  return normalized;
};

module.exports = {
  getRecommendations,
  client: smartKrishiClient
};
