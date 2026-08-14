const FarmerProfile = require("../../database/models/FarmerProfile");
const User = require("../../database/models/User");

const getProfile = async (userId) => {
  const profile = await FarmerProfile.findOne({ userId });
  if (!profile) {
    const err = new Error("Farmer profile context not found.");
    err.statusCode = 404;
    throw err;
  }
  return profile;
};

const updateProfile = async (userId, updateData) => {
  const profile = await FarmerProfile.findOne({ userId });
  if (!profile) {
    const err = new Error("Farmer profile context not found.");
    err.statusCode = 404;
    throw err;
  }

  // Fields allowed to update
  const allowedFields = [
    "fullName",
    "email",
    "language",
    "state",
    "district",
    "taluka",
    "village",
    "farmSize",
    "irrigationType",
    "soilType",
    "primaryCrops"
  ];

  // Merge updates
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      profile[field] = updateData[field];
    }
  });

  // Calculate profile completeness dynamically
  let filledFields = 0;
  const fieldsToCheck = [
    profile.fullName,
    profile.phone,
    profile.state,
    profile.district,
    profile.taluka,
    profile.village,
    profile.farmSize,
    profile.irrigationType,
    profile.soilType
  ];
  
  fieldsToCheck.forEach((f) => {
    if (f !== undefined && f !== null && f !== "") filledFields++;
  });
  
  if (profile.email) filledFields++;
  if (profile.primaryCrops && profile.primaryCrops.length > 0) filledFields++;

  const totalFields = fieldsToCheck.length + 2; // +email and +crops
  profile.profileCompletion = Math.round((filledFields / totalFields) * 100);

  // Sync name to User model if full name was modified
  if (updateData.fullName) {
    await User.findByIdAndUpdate(userId, { name: updateData.fullName });
  }

  await profile.save();
  return profile;
};

module.exports = {
  getProfile,
  updateProfile
};
