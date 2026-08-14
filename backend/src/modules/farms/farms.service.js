const Farm = require("../../database/models/Farm");

const getFarms = async (farmerId) => {
  return await Farm.find({ farmerId });
};

const createFarm = async (farmerId, farmData) => {
  const { name, area, areaUnit, location, district, taluka, village, soilType, irrigationType, waterSource, latitude, longitude } = farmData;

  if (!name || !area || !district || !taluka || !village) {
    const err = new Error("Name, area, and village coordinates are required.");
    err.statusCode = 400;
    throw err;
  }

  return await Farm.create({
    farmerId,
    name,
    area,
    areaUnit: areaUnit || "acres",
    location: location || "",
    district,
    taluka,
    village,
    soilType: soilType || "Medium Black Clayey Soil",
    irrigationType: irrigationType || "Drip Irrigation",
    waterSource: waterSource || "Tubewell",
    latitude: latitude || null,
    longitude: longitude || null
  });
};

const deleteFarm = async (farmerId, farmId) => {
  const farm = await Farm.findOneAndDelete({ _id: farmId, farmerId });
  if (!farm) {
    const err = new Error("Farm not found or unauthorized.");
    err.statusCode = 404;
    throw err;
  }
  return farm;
};

module.exports = {
  getFarms,
  createFarm,
  deleteFarm
};
