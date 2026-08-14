export const mockSoilData = {
  healthScore: 78,
  type: "Medium Black Clayey Soil",
  moisture: 38, // in %
  ph: 7.2, // slightly alkaline
  nutrients: {
    nitrogen: { value: 180, status: "Low", ideal: "280-560 kg/ha" },
    phosphorus: { value: 18, status: "Medium", ideal: "23-57 kg/ha" },
    potassium: { value: 310, status: "High", ideal: "140-280 kg/ha" },
    organicCarbon: { value: 0.45, status: "Low", ideal: "0.5% - 0.75%" }
  },
  recommendedCrops: [
    { name: "Cotton", suitability: 95, reason: "Soil pH and black clay structure is excellent for cotton taproot development." },
    { name: "Groundnut", suitability: 88, reason: "Moderate potassium level and clay-loam properties support pod filling." },
    { name: "Wheat", suitability: 82, reason: "Excellent water retention capacity during rabi season." }
  ],
  recommendedFertilizers: [
    { name: "Urea (Nitrogen Source)", dosage: "50 kg/acre", timing: "Basal dressing at sowing and top dressing at 30 days" },
    { name: "Single Super Phosphate (SSP)", dosage: "35 kg/acre", timing: "Basal application during land preparation" },
    { name: "Organic Compost / Farm Yard Manure", dosage: "5 tonnes/acre", timing: "Mix thoroughly into soil 3 weeks before sowing" }
  ],
  suggestions: [
    "Grow leguminous cover crops (like Sunn hemp) during fallow periods to fix atmospheric nitrogen.",
    "Apply bio-fertilizers such as Azotobacter and Phosphate Solubilizing Bacteria (PSB) to boost nutrient uptake.",
    "Adopt deep summer plowing to improve soil aeration and kill soil-borne pathogens."
  ],
  regionalProfiles: {
    "Central Gujarat": {
      soilType: "Goradu (Sandy Loam) & Medium Black",
      phRange: "6.8 - 7.5",
      commonCrops: ["Tobacco", "Paddy", "Cotton", "Wheat"],
      districts: ["Anand", "Kheda", "Vadodara", "Panchmahal", "Dahod"]
    },
    "Saurashtra": {
      soilType: "Medium Black & Shallow Sandy",
      phRange: "7.2 - 8.2",
      commonCrops: ["Groundnut", "Cotton", "Sesame", "Castor"],
      districts: ["Rajkot", "Junagadh", "Amreli", "Jamnagar", "Bhavnagar", "Morbi", "Devbhumi Dwarka", "Gir Somnath"]
    },
    "North Gujarat": {
      soilType: "Sandy & Alluvial Soil",
      phRange: "7.4 - 8.5",
      commonCrops: ["Castor", "Mustard", "Bajra", "Potato", "Fennel"],
      districts: ["Mehsana", "Patan", "Banaskantha", "Sabarkantha", "Gandhinagar", "Aravalli"]
    },
    "South Gujarat": {
      soilType: "Deep Black Clayey Soil",
      phRange: "6.2 - 7.2",
      commonCrops: ["Sugarcane", "Paddy", "Banana", "Mango"],
      districts: ["Surat", "Valsad", "Navsari", "Bharuch", "Narmada", "Tapi"]
    },
    "Kachchh": {
      soilType: "Saline Sandy & Desert Soil",
      phRange: "7.8 - 8.8",
      commonCrops: ["Date Palm", "Pomegranate", "Castor", "Guar"],
      districts: ["Kachchh"]
    }
  }
};
