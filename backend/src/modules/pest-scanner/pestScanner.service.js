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

  // 1. Upload image (to Cloudinary or local path fallback)
  const uploadResult = await cloudinaryClient.uploadImage(file);

  // 2. Query farmer crop block context to improve mock precision
  const profile = await FarmerProfile.findOne({ userId: farmerId });
  const primaryCrop = profile ? profile.mainCrop : "Cotton";

  // 3. Analyze leaf using ML prediction adapter
  const analysis = await pestAiClient.analyzeLeafImage(file.path, file.originalname);

  // Convert confidence to a 0-1 range decimal
  const confidenceDecimal = analysis.confidence > 1 ? analysis.confidence / 100 : analysis.confidence;

  // 4. Save to database history using new schema fields
  const scanRecord = await PestScan.create({
    farmerId,
    imageUrl: uploadResult.url,
    imagePublicId: uploadResult.publicId || "",
    detectedDisease: analysis.diseaseDetected,
    detectedPest: analysis.detectedPest || "Aphids",
    confidence: confidenceDecimal,
    severity: analysis.severity,
    symptoms: analysis.symptoms,
    possibleCauses: analysis.possibleCause,
    treatment: analysis.treatment,
    prevention: analysis.prevention,
    status: "completed"
  });

  // Map database document properties back to properties expected by the frontend
  return {
    id: scanRecord._id.toString(),
    imageUrl: scanRecord.imageUrl,
    diseaseDetected: scanRecord.detectedDisease,
    confidence: Math.round(scanRecord.confidence * 100), // convert back to percentage for frontend UI
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
    cropName: h.detectedDisease.includes("Cotton") ? "Cotton" : "Tomato",
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
