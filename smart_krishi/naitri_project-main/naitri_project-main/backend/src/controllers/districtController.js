const District = require('../models/District');

const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      count: districts.length,
      data: districts
    });
  } catch (error) {
    console.warn('Database query failed for districts, trying local dataset fallback:', error.message);
    try {
      const fs = require('fs');
      const path = require('path');
      const datasetPath = process.env.DATASET_PATH || path.join(__dirname, '../../../dataset.json/gujarat_agri_dataset_districtwise (1).json');
      if (fs.existsSync(datasetPath)) {
        const rawData = fs.readFileSync(datasetPath, 'utf8');
        const dataset = JSON.parse(rawData);
        const uniqueDistrictsMap = {};
        dataset.forEach(r => {
          const name = r.location?.district;
          if (name) {
            if (!uniqueDistrictsMap[name]) {
              uniqueDistrictsMap[name] = {
                _id: `mock-district-${Object.keys(uniqueDistrictsMap).length}`,
                name,
                region: r.location.region || 'Unknown',
                coordinates: { lat: r.location.latitude || 0, lng: r.location.longitude || 0 },
                suitableCrops: r.suitableCrops || []
              };
            }
          }
        });
        const districts = Object.values(uniqueDistrictsMap).sort((a, b) => a.name.localeCompare(b.name));
        return res.status(200).json({
          success: true,
          count: districts.length,
          data: districts
        });
      }
    } catch (fsErr) {
      console.error('Failed to read local dataset districts fallback:', fsErr.message);
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving districts.'
    });
  }
};

const getDistrictById = async (req, res) => {
  try {
    const district = await District.findById(req.params.id);
    if (!district) {
      return res.status(404).json({
        success: false,
        message: 'District not found.'
      });
    }
    return res.status(200).json({
      success: true,
      data: district
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving district.'
    });
  }
};

module.exports = {
  getAllDistricts,
  getDistrictById
};
