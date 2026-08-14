module.exports = {
  name: "irrigation_delay",
  evaluate: ({ weather, soil }) => {
    const rainProb = weather?.current?.rainProbability || 0;
    const soilMoisture = soil?.moisture || 40;

    if (rainProb >= 60) {
      return {
        title: "Rain Expected: Delay Next Irrigation Cycle",
        description: `High precipitation probability (${rainProb}%) detected in your area.`,
        reason: "Applying surface or drip irrigation prior to rain risks root rot and nutrient runoff.",
        action: "Pause drip irrigation for 24-48 hours. Ensure field drainage channels are unblocked.",
        priority: "high",
        type: "irrigation"
      };
    }

    if (soilMoisture < 30 && rainProb < 20) {
      return {
        title: "Soil Moisture Low: Schedule Drip Irrigation",
        description: `Current soil moisture level is ${soilMoisture}%, which is below optimal growth thresholds.`,
        reason: "Water stress during active vegetative growth hampers nutrient uptake and flowering.",
        action: "Schedule a 2-hour drip irrigation block during early morning or late evening.",
        priority: "medium",
        type: "irrigation"
      };
    }

    return null;
  }
};
