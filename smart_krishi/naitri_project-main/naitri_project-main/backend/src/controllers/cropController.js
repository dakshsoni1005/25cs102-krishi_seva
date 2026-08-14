const Crop = require('../models/Crop');
const { resolveDistrict } = require('../utils/resolve');

const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (error) {
    console.warn('Database query failed for crops, trying local dataset fallback:', error.message);
    try {
      const fs = require('fs');
      const path = require('path');
      const datasetPath = process.env.DATASET_PATH || path.join(__dirname, '../../../dataset.json/gujarat_agri_dataset_districtwise (1).json');
      if (fs.existsSync(datasetPath)) {
        const rawData = fs.readFileSync(datasetPath, 'utf8');
        const dataset = JSON.parse(rawData);
        const uniqueCropsSet = new Set();
        dataset.forEach(r => {
          if (r.crop?.name) uniqueCropsSet.add(r.crop.name);
        });
        const crops = [...uniqueCropsSet].sort().map((name, idx) => ({
          _id: `mock-crop-${idx}`,
          name
        }));
        return res.status(200).json({
          success: true,
          count: crops.length,
          data: crops
        });
      }
    } catch (fsErr) {
      console.error('Failed to read local dataset crops fallback:', fsErr.message);
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching crops.'
    });
  }
};

const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found.'
      });
    }
    return res.status(200).json({
      success: true,
      data: crop
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching crop.'
    });
  }
};

const getCropsByDistrict = async (req, res) => {
  try {
    const { district: districtIdentifier } = req.params;
    
    // Resolve the district (handles MongoDB query or local dataset fallback)
    const district = await resolveDistrict(districtIdentifier);
    
    if (!district) {
      return res.status(404).json({
        success: false,
        message: `District '${districtIdentifier}' not found.`
      });
    }
    
    return res.status(200).json({
      success: true,
      district: district.name,
      crops: district.suitableCrops || []
    });
  } catch (error) {
    console.error('Error in getCropsByDistrict:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching crops by district.'
    });
  }
};

module.exports = {
  getAllCrops,
  getCropById,
  getCropsByDistrict
};
