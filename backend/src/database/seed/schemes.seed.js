module.exports = [
  {
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description: "Central Sector scheme to provide income support to landholding farmers.",
    department: "Department of Agriculture, Cooperation & Farmers Welfare",
    state: "All India",
    benefits: "Direct income support of ₹6,000 per year in three equal installments of ₹2,000.",
    eligibility: {
      farmerType: "All landholder farmer families",
      maxLandSize: "No limit",
      state: "All India",
      crops: "All Crops"
    },
    requiredDocuments: ["Aadhar Card", "Land holding docs", "Bank Passbook"],
    applicationUrl: "https://pmkisan.gov.in/",
    deadline: "Dec 31, 2026",
    benefitType: "Direct Income Support",
    category: "Income Support",
    crops: "All Crops",
    farmerTypes: "All Farmers"
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Government-sponsored crop insurance scheme integrating multiple stakeholders.",
    department: "Ministry of Agriculture & Farmers Welfare",
    state: "All India",
    benefits: "Comprehensive insurance coverage against crop failure due to natural calamities.",
    eligibility: {
      farmerType: "All farmers",
      maxLandSize: "No limit",
      state: "All India",
      crops: "Food crops, Oilseeds, Horticultural crops"
    },
    requiredDocuments: ["Aadhar Card", "Land Record (7/12)", "Sowing Certificate", "Bank details"],
    applicationUrl: "https://pmfby.gov.in/",
    deadline: "Aug 31, 2026",
    benefitType: "Crop Insurance",
    category: "Crop Insurance",
    crops: "All Crops",
    farmerTypes: "All Farmers"
  },
  {
    name: "Gujarat Micro Irrigation Scheme (GGRC)",
    description: "Promoting drip and sprinkler irrigation technologies under GGRC guidelines.",
    department: "Gujarat Green Revolution Company Limited",
    state: "Gujarat",
    benefits: "70% to 90% subsidy on installation of Drip or Sprinkler systems.",
    eligibility: {
      farmerType: "All registered Gujarat landholders",
      maxLandSize: "5.0",
      state: "Gujarat",
      crops: "Cotton, Sugarcane, Vegetables, Groundnut"
    },
    requiredDocuments: ["Aadhar Card", "7/12 and 8-A reports", "Water source proof", "Quotation from GGRC supplier"],
    applicationUrl: "https://ggrc.co.in/",
    deadline: "Mar 31, 2027",
    benefitType: "Subsidies & Equipment",
    category: "Irrigation Subsidies",
    crops: "Cotton, Sugarcane, Vegetables, Groundnut",
    farmerTypes: "Landholding Farmers"
  }
];
