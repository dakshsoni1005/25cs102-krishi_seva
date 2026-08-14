module.exports = {
  name: "pest_outbreak_warning",
  evaluate: ({ pestScans }) => {
    if (!pestScans || pestScans.length === 0) return null;

    const latestScan = pestScans[0];
    if (latestScan.severity === "High" || latestScan.confidence >= 0.85) {
      return {
        title: `Pest Alert: Active ${latestScan.detectedDisease || "Pest"} Outbreak Detected`,
        description: `Your recent scan identified ${latestScan.detectedDisease} with high severity.`,
        reason: "Unchecked pest reproduction can destroy surrounding crop foliage within 5-7 days.",
        action: latestScan.treatment?.organic || "Spray 5% Neem Seed Kernel Extract (NSKE) immediately.",
        priority: "high",
        type: "pest"
      };
    }

    return null;
  }
};
