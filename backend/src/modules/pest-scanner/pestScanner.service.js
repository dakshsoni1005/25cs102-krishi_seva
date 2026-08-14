const PestScan = require("../../database/models/PestScan");
const cloudinaryClient = require("../../integrations/cloudinary/cloudinary.client");
const pestAiClient = require("../../integrations/pest-ai/pestAi.client");
const FarmerProfile = require("../../database/models/FarmerProfile");

const analyzeLeaf = async (farmerId, file) => {
  if (!file) {
    const err = new Error("No image file uploaded.");
    err.statusCode = 400;
    throw err;
  }

  // 1. Upload image (to Cloudinary or local static path)
  const uploadResult = await cloudinaryClient.uploadImage(file);

  // 2. Query farmer crop block context
  const profile = await FarmerProfile.findOne({ userId: farmerId });
  const primaryCrop = profile ? profile.mainCrop : "Crop";

  // 3. Analyze leaf using ML prediction adapter
  const analysis = await pestAiClient.analyzeLeafImage(file.path, file.originalname);

  // Convert confidence to decimal range (0-1)
  const confidenceDecimal = analysis.confidence > 1 ? analysis.confidence / 100 : analysis.confidence;

  // 4. Save scan record to database history
  const scanRecord = await PestScan.create({
    farmerId,
    imageUrl: uploadResult.url,
    imagePublicId: uploadResult.publicId || "",
    detectedDisease: analysis.diseaseDetected,
    detectedPest: analysis.detectedPest || analysis.diseaseDetected,
    confidence: confidenceDecimal,
    severity: analysis.severity,
    symptoms: analysis.symptoms,
    possibleCauses: analysis.possibleCause,
    treatment: analysis.treatment,
    prevention: analysis.prevention,
    status: "completed"
  });

  return {
    id: scanRecord._id.toString(),
    imageUrl: scanRecord.imageUrl,
    diseaseDetected: scanRecord.detectedDisease,
    confidence: Math.round(scanRecord.confidence * 100),
    severity: scanRecord.severity,
    cropName: primaryCrop,
    symptoms: scanRecord.symptoms,
    possibleCause: scanRecord.possibleCauses,
    treatment: scanRecord.treatment,
    prevention: scanRecord.prevention,
    createdAt: scanRecord.createdAt
  };
};

const getScanHistory = async (farmerId) => {
  const history = await PestScan.find({ farmerId }).sort({ createdAt: -1 }).lean();
  
  return history.map((h) => ({
    id: h._id.toString(),
    imageUrl: h.imageUrl,
    diseaseDetected: h.detectedDisease,
    confidence: Math.round(h.confidence * 100),
    severity: h.severity,
    cropName: h.detectedDisease.includes("Cotton") ? "Cotton" : "Crop Block",
    symptoms: h.symptoms,
    possibleCause: h.possibleCauses,
    treatment: h.treatment,
    prevention: h.prevention,
    createdAt: h.createdAt
  }));
};

module.exports = {
  analyzeLeaf,
  getScanHistory
};
