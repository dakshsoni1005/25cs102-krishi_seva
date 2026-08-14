const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../database/models/User");
const FarmerProfile = require("../../database/models/FarmerProfile");
const Farm = require("../../database/models/Farm");
const SoilProfile = require("../../database/models/SoilProfile");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../../utils/jwt");

const register = async (farmerData) => {
  const { fullName, mobileNumber, email, password, state, district, taluka, village, farmSize, mainCrop, irrigationType } = farmerData;

  // 1. Verify user does not exist (read query outside transaction is fine)
  const existingUser = await User.findOne({ phone: mobileNumber });
  if (existingUser) {
    const err = new Error("A farmer account with this mobile number is already registered.");
    err.statusCode = 400;
    err.code = "USER_EXISTS";
    throw err;
  }

  // 2. Hash Password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 3. Initiate Transaction Session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 4. Create User
    const newUser = new User({
      name: fullName,
      phone: mobileNumber,
      email: email || undefined, // undefined prevents unique sparse index collision on empty string
      passwordHash,
      role: "farmer"
    });
    await newUser.save({ session });

    // 5. Create Farmer Profile (Shared context)
    const newProfile = new FarmerProfile({
      userId: newUser._id,
      fullName,
      phone: mobileNumber,
      email: email || "",
      state,
      district,
      taluka,
      village,
      farmSize: farmSize || 5.0,
      farmSizeUnit: "acres",
      mainCrop: mainCrop || "Cotton",
      irrigationType: irrigationType || "Rainfed",
      profileCompletion: 90
    });
    await newProfile.save({ session });

    // 6. Create default farm parcel
    const newFarm = new Farm({
      farmerId: newUser._id,
      name: `${village} Block A`,
      area: farmSize || 5.0,
      areaUnit: "acres",
      state,
      district,
      taluka,
      village,
      soilType: "Medium Black Clayey Soil",
      irrigationType: irrigationType || "Rainfed"
    });
    await newFarm.save({ session });

    // 7. Create default soil advisory card
    const newSoil = new SoilProfile({
      farmerId: newUser._id,
      farmId: newFarm._id,
      region: "Central Gujarat", // Default central region
      state,
      district,
      taluka,
      village,
      soilType: "Medium Black Clayey Soil",
      ph: 7.2,
      nitrogen: 180,
      phosphorus: 18,
      potassium: 310,
      organicCarbon: 0.45,
      moisture: 35,
      healthScore: 78
    });
    await newSoil.save({ session });

    // Commit writes
    await session.commitTransaction();
    session.endSession();

    // 8. Sign tokens
    const accessToken = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id, newUser.role);

    return {
      token: accessToken,
      refreshToken,
      farmer: {
        userId: newUser._id,
        fullName: newProfile.fullName,
        mobileNumber: newProfile.phone,
        email: newProfile.email,
        state: newProfile.state,
        district: newProfile.district,
        taluka: newProfile.taluka,
        village: newProfile.village,
        farmSize: newProfile.farmSize,
        mainCrop: newProfile.mainCrop,
        irrigationType: newProfile.irrigationType,
        profileCompletion: newProfile.profileCompletion
      }
    };
  } catch (error) {
    // Rollback changes if any fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const login = async (identifier, password) => {
  if (!identifier || !password) {
    const err = new Error("Mobile number/email and password are required.");
    err.statusCode = 400;
    err.code = "MISSING_CREDENTIALS";
    throw err;
  }

  const cleanId = String(identifier).trim();
  const isEmail = cleanId.includes("@");

  // 1. Search User by Phone or Email (explicitly select passwordHash)
  let user = await User.findOne(
    isEmail ? { email: cleanId.toLowerCase() } : { phone: cleanId }
  ).select("+passwordHash");

  if (!user && !isEmail) {
    user = await User.findOne({ email: cleanId.toLowerCase() }).select("+passwordHash");
  }

  if (!user || !user.isActive) {
    const err = new Error("Invalid mobile number/email or password.");
    err.statusCode = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  // 2. Validate Password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error("Invalid mobile number/email or password.");
    err.statusCode = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  // Update last login timestamp
  user.lastLoginAt = new Date();
  await user.save();

  // 3. Find profile
  const profile = await FarmerProfile.findOne({ userId: user._id });
  if (!profile) {
    const err = new Error("Farmer profile context not found.");
    err.statusCode = 404;
    err.code = "PROFILE_NOT_FOUND";
    throw err;
  }

  // 4. Generate Tokens
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  return {
    token: accessToken,
    refreshToken,
    farmer: {
      userId: user._id,
      fullName: profile.fullName,
      mobileNumber: profile.phone,
      email: profile.email,
      state: profile.state,
      district: profile.district,
      taluka: profile.taluka,
      village: profile.village,
      farmSize: profile.farmSize,
      mainCrop: profile.mainCrop,
      irrigationType: profile.irrigationType,
      profileCompletion: profile.profileCompletion
    }
  };
};

const refresh = async (token) => {
  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    const err = new Error("Invalid or expired refresh token.");
    err.statusCode = 401;
    err.code = "INVALID_REFRESH";
    throw err;
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    const err = new Error("User associated with this token is no longer active.");
    err.statusCode = 401;
    err.code = "INVALID_USER";
    throw err;
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id, user.role);

  return {
    token: accessToken,
    refreshToken: newRefreshToken
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User record not found.");
    err.statusCode = 404;
    throw err;
  }

  const profile = await FarmerProfile.findOne({ userId });
  if (!profile) {
    const err = new Error("Farmer profile context not found.");
    err.statusCode = 404;
    throw err;
  }

  return {
    userId: user._id,
    fullName: profile.fullName,
    mobileNumber: profile.phone,
    email: profile.email,
    state: profile.state,
    district: profile.district,
    taluka: profile.taluka,
    village: profile.village,
    farmSize: profile.farmSize,
    mainCrop: profile.mainCrop,
    irrigationType: profile.irrigationType,
    profileCompletion: profile.profileCompletion
  };
};

module.exports = {
  register,
  login,
  refresh,
  getMe
};
