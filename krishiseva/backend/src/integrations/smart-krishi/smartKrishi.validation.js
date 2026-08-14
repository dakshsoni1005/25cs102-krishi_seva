const validateRecommendationRequest = (payload) => {
  const errors = [];
  
  if (!payload || typeof payload !== "object") {
    return { isValid: false, errors: ["Invalid payload object."] };
  }

  if (!payload.district || typeof payload.district !== "string" || !payload.district.trim()) {
    errors.push("District parameter is required.");
  }

  if (!payload.crop || typeof payload.crop !== "string" || !payload.crop.trim()) {
    errors.push("Crop parameter is required.");
  }

  if (!payload.season || typeof payload.season !== "string" || !payload.season.trim()) {
    errors.push("Season parameter is required.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateRecommendationRequest
};
