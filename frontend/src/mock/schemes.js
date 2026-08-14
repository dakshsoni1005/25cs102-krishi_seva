export const mockSchemes = [
  {
    id: "sch-1",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    department: "Department of Agriculture, Cooperation & Farmers Welfare",
    eligibility: {
      farmerType: "All landholder farmer families",
      maxLandSize: "No limit (previously 2 hectares)",
      state: "All India",
      crops: "All Crops"
    },
    benefits: "Direct income support of ₹6,000 per year in three equal installments of ₹2,000 directly into bank accounts.",
    applicationStatus: "Approved", // Approved, Pending, Eligible, Not Eligible, Applied
    deadline: "Dec 31, 2026",
    benefitType: "Direct Income Support"
  },
  {
    id: "sch-2",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    department: "Ministry of Agriculture & Farmers Welfare",
    eligibility: {
      farmerType: "All farmers (including sharecroppers and tenant farmers)",
      maxLandSize: "No limit",
      state: "All India",
      crops: "Food crops, Oilseeds, Annual Commercial/Horticultural crops"
    },
    benefits: "Comprehensive insurance coverage against crop failure due to natural calamities, pests, and diseases. Premium capped at 1.5% - 2% for food crops.",
    applicationStatus: "Eligible",
    deadline: "Aug 31, 2026",
    benefitType: "Crop Insurance"
  },
  {
    id: "sch-3",
    name: "Gujarat Micro Irrigation Scheme (GGRC)",
    department: "Gujarat Green Revolution Company Limited",
    eligibility: {
      farmerType: "All farmers registered in Gujarat",
      maxLandSize: "5 hectares",
      state: "Gujarat",
      crops: "Cotton, Sugarcane, Vegetables, Groundnut, Castor"
    },
    benefits: "70% to 90% subsidy on installation of Drip or Sprinkler irrigation systems for saving water and power.",
    applicationStatus: "Pending",
    deadline: "Mar 31, 2027",
    benefitType: "Subsidies & Equipment"
  },
  {
    id: "sch-4",
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    department: "Department of Agriculture & Cooperation",
    eligibility: {
      farmerType: "Small, Marginal, SC/ST, and Women Farmers",
      maxLandSize: "No limit",
      state: "All India",
      crops: "All Crops"
    },
    benefits: "40% to 50% financial assistance for purchasing agricultural machinery such as tractors, rotavators, power tillers, and seed drills.",
    applicationStatus: "Eligible",
    deadline: "Oct 15, 2026",
    benefitType: "Subsidies & Equipment"
  },
  {
    id: "sch-5",
    name: "PM Krishi Sinchayee Yojana (PMKSY) - Har Khet Ko Pani",
    department: "Ministry of Jal Shakti",
    eligibility: {
      farmerType: "All Farmers with cultivable land",
      maxLandSize: "No limit",
      state: "All India",
      crops: "All Crops"
    },
    benefits: "Financial grants for developing tube wells, shallow wells, water harvesting structures, and restoring traditional water bodies.",
    applicationStatus: "Eligible",
    deadline: "Nov 30, 2026",
    benefitType: "Irrigation Support"
  }
];

export const mockEligibilityCheck = (farmer, scheme) => {
  // Let's implement a logical mock check
  // Compare state, land size, and crop suitability
  if (scheme.eligibility.state !== "All India" && scheme.eligibility.state !== farmer.state) {
    return {
      eligible: false,
      reason: `This scheme is only available for residents of ${scheme.eligibility.state}. Your registered state is ${farmer.state}.`
    };
  }

  if (scheme.eligibility.maxLandSize !== "No limit") {
    const maxVal = parseFloat(scheme.eligibility.maxLandSize.split(" ")[0]);
    if (farmer.farmSize > maxVal) {
      return {
        eligible: false,
        reason: `Your farm size is ${farmer.farmSize} acres, which exceeds the scheme limit of ${maxVal} hectares (approx ${Math.round(maxVal * 2.47)} acres).`
      };
    }
  }

  // Eligible!
  return {
    eligible: true,
    reason: "You meet all eligibility criteria, including location registration, landholding scale, and crop profile constraints.",
    nextSteps: "Click 'Apply Now' to fill out the form and upload your Land Record (7/12, 8-A), Aadhar Card, and Bank Passbook."
  };
};
