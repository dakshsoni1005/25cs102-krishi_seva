const fs = require('fs');

const isSoilSuitable = (districtSoilType, suitableSoilsList) => {
  if (!districtSoilType || !suitableSoilsList || !suitableSoilsList.length) return false;
  const cleanDistrictSoil = districtSoilType.toLowerCase().trim();
  return suitableSoilsList.some(suitableSoil => {
    const cleanSuitableSoil = suitableSoil.toLowerCase().trim();
    return cleanDistrictSoil === cleanSuitableSoil;
  });
};

const run = () => {
  const rawData = fs.readFileSync('E:/daksh soni/dataset.json/gujarat_agri_dataset.json', 'utf8');
  const dataset = JSON.parse(rawData);

  const districtSoils = {};
  const cropSoils = {};

  dataset.forEach(r => {
    const d = r.location.district;
    if (d && r.soil?.type) {
      districtSoils[d] = r.soil.type;
    }
    const c = r.crop?.name;
    if (c && r.soil?.type) {
      if (!cropSoils[c]) {
        cropSoils[c] = new Set();
      }
      cropSoils[c].add(r.soil.type);
    }
  });

  Object.keys(districtSoils).forEach(d => {
    const dSoil = districtSoils[d];
    console.log(`\nDistrict: ${d} | Soil: ${dSoil}`);

    let suitableCount = 0;
    let unsuitableCount = 0;

    Object.keys(cropSoils).forEach(c => {
      const cSoils = [...cropSoils[c]];
      const suitable = isSoilSuitable(dSoil, cSoils);
      if (suitable) {
        suitableCount++;
      } else {
        unsuitableCount++;
        console.log(` - UNSUITABLE CROP: ${c} (Requires: ${cSoils.join(', ')})`);
      }
    });

    console.log(` => Suitable: ${suitableCount} | Unsuitable: ${unsuitableCount}`);
  });
};

run();
