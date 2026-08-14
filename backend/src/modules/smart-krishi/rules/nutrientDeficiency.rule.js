module.exports = {
  name: "nutrient_deficiency_advisory",
  evaluate: ({ soil }) => {
    if (!soil) return null;

    if (soil.nitrogen < 160) {
      return {
        title: "Soil Deficiency: Low Nitrogen Level Detected",
        description: `Nitrogen level is currently ${soil.nitrogen} kg/ha (optimal is > 200 kg/ha).`,
        reason: "Nitrogen deficiency leads to stunted vegetative shoots and chlorotic leaves.",
        action: "Apply 50 kg/acre Urea top dressing or incorporate leguminous green manure.",
        priority: "medium",
        type: "fertilizer"
      };
    }

    if (soil.phosphorus < 15) {
      return {
        title: "Soil Deficiency: Low Phosphorus Level Detected",
        description: `Phosphorus level is currently ${soil.phosphorus} kg/ha (optimal is > 25 kg/ha).`,
        reason: "Phosphorus is critical for strong root anchoring and flowering response.",
        action: "Apply Single Super Phosphate (SSP) @ 35 kg/acre during basal plowing.",
        priority: "medium",
        type: "fertilizer"
      };
    }

    return null;
  }
};
