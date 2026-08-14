const GovernmentScheme = require("../../database/models/GovernmentScheme");
const SchemeEligibility = require("../../database/models/SchemeEligibility");
const FarmerProfile = require("../../database/models/FarmerProfile");

const getSchemesList = async (filters = {}) => {
  const { search, state, crop, benefitType } = filters;
  const query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  if (state && state !== "All India") {
    query.$or = [
      { "eligibility.state": "All India" },
      { "eligibility.state": { $regex: `^${state}$`, $options: "i" } }
    ];
  }

  if (crop) {
    query.$or = [
      { "eligibility.crops": "All Crops" },
      { "eligibility.crops": { $regex: crop, $options: "i" } }
    ];
  }

  if (benefitType) {
    query.benefitType = benefitType;
  }

  return await GovernmentScheme.find(query);
};

const getRecommendedSchemes = async (farmerId) => {
  const profile = await FarmerProfile.findOne({ userId: farmerId });
  if (!profile) return [];

  // Find schemes matching farmer state or all india, and farmer crops
  const query = {
    isActive: true,
    $or: [
      { "eligibility.state": "All India" },
      { "eligibility.state": profile.state }
    ]
  };

  const allSchemes = await GovernmentScheme.find(query);
  
  // Simple check for eligibility to return as recommended
  const recommended = [];
  for (const scheme of allSchemes) {
    const isCropMatch = scheme.eligibility.crops === "All Crops" || 
      scheme.eligibility.crops.toLowerCase().includes(profile.mainCrop.toLowerCase());
    
    let isLandMatch = true;
    if (scheme.eligibility.maxLandSize !== "No limit") {
      const maxVal = parseFloat(scheme.eligibility.maxLandSize);
      // Convert hectares to acres (~2.47 acres/hectare) for profile check
      const farmSizeHectares = profile.farmSize / 2.47;
      if (farmSizeHectares > maxVal) {
        isLandMatch = false;
      }
    }

    if (isCropMatch && isLandMatch) {
      recommended.push(scheme);
    }
  }

  return recommended;
};

const checkEligibility = async (farmerId, schemeId) => {
  const profile = await FarmerProfile.findOne({ userId: farmerId });
  const scheme = await GovernmentScheme.findById(schemeId);

  if (!profile || !scheme) {
    const err = new Error("Farmer profile or scheme not found.");
    err.statusCode = 404;
    throw err;
  }

  // 1. Evaluate State compliance
  if (scheme.eligibility.state !== "All India" && 
      scheme.eligibility.state.toLowerCase() !== profile.state.toLowerCase()) {
    const reason = `This scheme is only available for residents of ${scheme.eligibility.state}. Your registered state is ${profile.state}.`;
    return saveAndReturnEligibility(farmerId, schemeId, false, reason, "Not Eligible");
  }

  // 2. Evaluate Land limits compliance
  if (scheme.eligibility.maxLandSize !== "No limit") {
    const maxVal = parseFloat(scheme.eligibility.maxLandSize);
    const sizeHectares = profile.farmSize / 2.47;
    if (sizeHectares > maxVal) {
      const reason = `Your farm size is ${profile.farmSize} acres (~${sizeHectares.toFixed(1)} hectares), which exceeds the scheme limit of ${maxVal} hectares.`;
      return saveAndReturnEligibility(farmerId, schemeId, false, reason, "Not Eligible");
    }
  }

  // 3. Evaluate Crop compliance
  const cropCheck = scheme.eligibility.crops === "All Crops" || 
    scheme.eligibility.crops.toLowerCase().includes(profile.mainCrop.toLowerCase());

  if (!cropCheck) {
    const reason = `This scheme is targeted for ${scheme.eligibility.crops}. Your registered main crop is ${profile.mainCrop}.`;
    return saveAndReturnEligibility(farmerId, schemeId, false, reason, "Not Eligible");
  }

  // Eligible!
  const reason = "You meet all eligibility criteria, including location registration, landholding scale, and crop profile constraints.";
  const nextSteps = "Click 'Apply Now' to fill out the form and upload your Land Record (7/12, 8-A), Aadhar Card, and Bank Passbook.";
  
  return saveAndReturnEligibility(farmerId, schemeId, true, reason, "Eligible", nextSteps);
};

const saveAndReturnEligibility = async (farmerId, schemeId, eligible, reason, status, nextSteps = "") => {
  const result = await SchemeEligibility.findOneAndUpdate(
    { farmerId, schemeId },
    {
      eligible,
      reason,
      nextSteps,
      status,
      checkedAt: new Date()
    },
    { upsert: true, new: true }
  );

  return {
    eligible: result.eligible,
    reason: result.reason,
    nextSteps: result.nextSteps,
    status: result.status
  };
};

module.exports = {
  getSchemesList,
  getRecommendedSchemes,
  checkEligibility
};
