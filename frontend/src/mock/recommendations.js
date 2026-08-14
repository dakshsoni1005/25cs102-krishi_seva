export const mockRecommendations = [
  {
    id: "rec-1",
    category: "Irrigation",
    priority: "HIGH",
    title: "Rain Expected: Delay Next Irrigation Cycle",
    explanation: "Our weather systems indicate heavy rain tomorrow. Proceeding with your planned irrigation today will lead to over-saturation and potential root rot.",
    reason: "Weather forecast shows an 85% to 95% probability of precipitation (>25mm) over Anand district tomorrow.",
    action: "Delay irrigation for 24-48 hours. Ensure field drainage channels are clear of debris.",
    benefit: "Saves water, reduces electricity consumption, and prevents soil waterlogging/nutrient leaching.",
    timestamp: "2026-08-15T06:30:00Z"
  },
  {
    id: "rec-2",
    category: "Fertilizer",
    priority: "MEDIUM",
    title: "Apply Basal Nitrogen for Groundnut Block A",
    explanation: "Based on soil tests, nitrogen levels are low (180 kg/ha vs ideal >280 kg/ha). Groundnut seedlings are currently entering vegetative phase.",
    reason: "Low nitrogen is causing slight yellowing of bottom leaves, which will slow down growth.",
    action: "Apply 50 kg/acre of Urea. Apply when soil has moderate moisture, preferably before a light drizzle.",
    benefit: "Improves vegetative growth, promotes healthy leaf area, and increases photosynthetic efficiency.",
    timestamp: "2026-08-15T06:30:00Z"
  },
  {
    id: "rec-3",
    category: "Pest Control",
    priority: "HIGH",
    title: "High Risk of Cotton Aphids in Surrounding Region",
    explanation: "Local APMC offices and farmers in Anand have reported Cotton Aphid outbreaks. Weather conditions (humid mornings, warm afternoons) are ideal for pest multiplication.",
    reason: "Regional crop surveillance data indicates aphid density has crossed the Economic Threshold Level (ETL) in neighboring villages.",
    action: "Set up yellow sticky traps (10 per acre) and inspect crop leaf under-surfaces daily. Spray 5% NSKE (Neem Seed Kernel Extract) as a preventive measure.",
    benefit: "Early pest suppression before damage occurs, avoiding heavy chemical pesticide costs.",
    timestamp: "2026-08-14T10:15:00Z"
  },
  {
    id: "rec-4",
    category: "Market Timing",
    priority: "LOW",
    title: "Cotton Price Peak: Consider Partial Sales",
    explanation: "Gondal and Rajkot APMC prices for Bt Cotton have touched a seasonal high of ₹7,600/quintal due to short-term demand spikes from spinning mills.",
    reason: "Market supply is low while exports are steady, keeping prices 8% above the minimum support price (MSP).",
    action: "If you have stored cotton stocks from the previous season, liquidate 30-40% of inventory to secure current high margins.",
    benefit: "Locks in optimal profits and mitigates the risk of subsequent price corrections when new harvest floods the market.",
    timestamp: "2026-08-14T08:00:00Z"
  },
  {
    id: "rec-5",
    category: "Crop Health",
    priority: "MEDIUM",
    title: "Magnesium Deficiency Warning in Cotton",
    explanation: "Reddish-purple discoloration between green leaf veins is visible in vegetative cotton plants, indicating magnesium deficiency.",
    reason: "Leached sandy soils under heavy irrigation often develop localized magnesium deficiencies.",
    action: "Spray Foliar Magnesium Sulphate (MgSO4) @ 10g/L of water. Repeat after 10 days.",
    benefit: "Restores green chlorophyll, prevents premature leaf drop, and improves boll size.",
    timestamp: "2026-08-13T14:20:00Z"
  }
];
