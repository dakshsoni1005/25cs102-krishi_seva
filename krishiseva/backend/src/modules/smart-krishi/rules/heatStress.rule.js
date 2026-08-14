module.exports = {
  name: "heat_stress_warning",
  evaluate: ({ weather }) => {
    const temp = weather?.current?.temp || 30;

    if (temp >= 38) {
      return {
        title: "Extreme Heat Warning: Protect Crops from Desiccation",
        description: `Ambient temperature has reached ${temp}°C.`,
        reason: "Excessive heat accelerates transpiration, causing leaf wilt and flower drop.",
        action: "Provide light micro-sprinkling during peak afternoon hours and apply organic mulch.",
        priority: "critical",
        type: "weather"
      };
    }

    return null;
  }
};
