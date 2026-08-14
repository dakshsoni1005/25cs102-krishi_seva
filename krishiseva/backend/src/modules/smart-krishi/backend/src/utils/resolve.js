const mongoose = require('mongoose');
const District = require('../models/District');
const Crop = require('../models/Crop');
const fs = require('fs');

const path = require('path');

const getLocalDatasetFallback = () => {
  try {
    const datasetPath = process.env.DATASET_PATH || path.join(__dirname, '../../../dataset.json/gujarat_agri_dataset_districtwise (1).json');
    if (fs.existsSync(datasetPath)) {
      const rawData = fs.readFileSync(datasetPath, 'utf8');
      return JSON.parse(rawData);
    }
  } catch (err) {
    console.error('Failed to load local dataset fallback:', err.message);
  }
  return null;
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const resolveDistrict = async (identifier) => {
  if (!identifier) return null;
  
  try {
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const district = await District.findById(identifier);
      if (district) return district;
    }
    const escaped = escapeRegExp(identifier);
    const district = await District.findOne({ name: { $regex: new RegExp(`^${escaped}$`, 'i') } });
    if (district) return district;
  } catch (dbErr) {
    console.warn('Database resolveDistrict failed, trying local dataset fallback:', dbErr.message);
  }

  // Fallback to local dataset
  const dataset = getLocalDatasetFallback();
  if (dataset) {
    const match = dataset.find(r => r.location.district.toLowerCase() === identifier.toLowerCase());
    if (match) {
      return {
        _id: new mongoose.Types.ObjectId(),
        name: match.location.district,
        region: match.location.region || 'Unknown',
        coordinates: { lat: match.location.latitude || 0, lng: match.location.longitude || 0 },
        suitableCrops: match.suitableCrops || []
      };
    }
  }
  return null;
};

const resolveCrop = async (identifier) => {
  if (!identifier) return null;
  
  try {
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      const crop = await Crop.findById(identifier);
      if (crop) return crop;
    }
    const escaped = escapeRegExp(identifier);
    // 1. Try exact match
    let crop = await Crop.findOne({ name: { $regex: new RegExp(`^${escaped}$`, 'i') } });
    if (crop) return crop;

    // 2. Try contains/prefix match
    crop = await Crop.findOne({ name: { $regex: new RegExp(escaped, 'i') } });
    if (crop) return crop;

    // 3. Shorthand mappings
    if (identifier.toLowerCase() === 'rice') {
      crop = await Crop.findOne({ name: { $regex: /paddy/i } });
      if (crop) return crop;
    }
    if (identifier.toLowerCase() === 'sapota') {
      crop = await Crop.findOne({ name: { $regex: /chikoo/i } });
      if (crop) return crop;
    }
    if (identifier.toLowerCase() === 'pigeon pea') {
      crop = await Crop.findOne({ name: { $regex: /tur/i } });
      if (crop) return crop;
    }
  } catch (dbErr) {
    console.warn('Database resolveCrop failed, trying local dataset fallback:', dbErr.message);
  }

  // Fallback to local dataset
  const dataset = getLocalDatasetFallback();
  if (dataset) {
    const searchStr = identifier.toLowerCase();
    
    // 1. Try exact match
    let match = dataset.find(r => r.crop.name.toLowerCase() === searchStr);
    
    // 2. Try contains match
    if (!match) {
      match = dataset.find(r => r.crop.name.toLowerCase().includes(searchStr));
    }
    
    // 3. Shorthand mapping matches
    if (!match && searchStr === 'rice') {
      match = dataset.find(r => r.crop.name.toLowerCase().includes('paddy'));
    }
    if (!match && searchStr === 'sapota') {
      match = dataset.find(r => r.crop.name.toLowerCase().includes('chikoo'));
    }
    if (!match && searchStr === 'pigeon pea') {
      match = dataset.find(r => r.crop.name.toLowerCase().includes('tur'));
    }

    if (match) {
      return {
        _id: new mongoose.Types.ObjectId(),
        name: match.crop.name
      };
    }
  }
  return null;
};

module.exports = {
  resolveDistrict,
  resolveCrop
};
