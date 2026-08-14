const mongoose = require('mongoose');
const dotenv = require('dotenv');
const District = require('../src/models/District');
const Crop = require('../src/models/Crop');
const SoilData = require('../src/models/SoilData');
const CropRequirement = require('../src/models/CropRequirement');
const { resolveDistrict, resolveCrop } = require('../src/utils/resolve');

dotenv.config({ path: 'E:/daksh soni/backend/.env' });

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully!');

    console.log('Resolving Anand district...');
    const district = await resolveDistrict('Anand');
    console.log('District:', district?.name);

    console.log('Resolving Cotton crop...');
    const crop = await resolveCrop('Cotton');
    console.log('Crop:', crop?.name);

    console.log('Fetching SoilData for Anand...');
    const soil = await SoilData.findOne({ district_id: district._id });
    console.log('Soil Type:', soil?.type);

    console.log('Fetching CropRequirement for Cotton...');
    const cropReq = await CropRequirement.findOne({ crop_id: crop._id });
    console.log('Suitable Soils:', cropReq?.suitableSoils);

    console.log('Fetching all CropRequirements with populate...');
    const allReqs = await CropRequirement.find({}).populate('crop_id');
    console.log('Loaded requirements count:', allReqs.length);

  } catch (err) {
    console.error('Error during database check:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
};

run();
