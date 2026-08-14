export const mockChatQA = [
  {
    question: "What fertilizer should I use for cotton?",
    response: `For Bt Cotton during the vegetative phase (around 45-60 days):
1. **Nitrogen (N):** Apply Urea @ 50 kg/acre as a top dressing. Make sure the soil has adequate moisture.
2. **Phosphorus (P) & Potassium (K):** If not applied as basal dressing, apply DAP @ 50 kg/acre or NPK (12:32:16) @ 75 kg/acre.
3. **Secondary/Micro Nutrients:** Apply Zinc Sulphate @ 10 kg/acre and Magnesium Sulphate @ 15 kg/acre to prevent red leaf disease (Lal Patti).
4. **Foliar Spray:** Spray 2% Urea or 1% Potassium Nitrate during flowering to increase boll size.`
  },
  {
    question: "Will it rain tomorrow?",
    response: `Yes, weather models indicate a very high probability (95%) of heavy rain tomorrow in Anand, Gujarat.
- Expected rainfall: 25 - 40 mm.
- Recommendations:
  1. Immediately **delay any scheduled irrigation** for the next 48 hours.
  2. Postpone fertilizer or pesticide spraying, as they will get washed away.
  3. Ensure drainage channels are clear to prevent waterlogging in low-lying crop blocks.`
  },
  {
    question: "Why are my leaves turning yellow?",
    response: `Yellowing of leaves (chlorosis) in cotton/groundnut is usually caused by:
1. **Nitrogen Deficiency:** Old leaves turn pale yellow first, spreading from the tip inwards. Treat by applying Urea or foliar spray of 2% Urea.
2. **Iron Deficiency:** New leaves show yellowing between veins (interveinal chlorosis). Common in calcareous/alkaline soils. Treat with ferrous sulphate foliar spray @ 5g/L.
3. **Overwatering/Waterlogging:** Root oxygen deprivation blocks nutrient uptake. Ensure drainage.
4. **Sucking Pests (Jassids/Aphids):** Leaves curl downwards and turn yellow. Scan them using the **AI Pest Scanner** for precise diagnosis.`
  },
  {
    question: "Which crop should I grow this season?",
    response: `Based on your location in Anand (Central Gujarat) and medium-black sandy loam soil:
- **Kharif Season (Monsoon):**
  1. **Bt Cotton:** Best soil suitability, high return potential.
  2. **Groundnut (GG-20):** High nitrogen fixing, requires less water than paddy.
  3. **Paddy:** Only if you have assured canal or tubewell irrigation with clayey soil sections.
- **Rabi Season (Winter):**
  1. **Wheat (GW-496/322):** Excellent response to cold mornings.
  2. **Mustard:** Highly drought tolerant, requires only 2-3 irrigations.
  3. **Castor:** High revenue crop, grows well on sandy loam.`
  },
  {
    question: "Show today's market prices.",
    response: `Here are the latest average prices from Gondal & Rajkot APMC (as of August 14, 2026):
- **Bt Cotton:** ₹7,200 / quintal (Trend: 📈 Up by ₹50)
- **Groundnut (G-20):** ₹6,650 / quintal (Trend: 📉 Down by ₹20)
- **Wheat (Lokwan):** ₹2,625 / quintal (Trend: 📈 Up by ₹10)
- **Castor:** ₹6,100 / quintal (Trend: 📉 Down by ₹15)
- **Sesame (White):** ₹12,250 / quintal (Trend: 📈 Up by ₹100)
Go to the **Market Prices** tab to see detailed district filters and charts.`
  },
  {
    question: "Which government schemes am I eligible for?",
    response: `Based on your profile (Ramesh Patel, State: Gujarat, Farm Size: 12.5 acres, Crop: Cotton):
1. **PM-KISAN:** Eligible. Income support of ₹6,000/year (status: Approved).
2. **PM Fasal Bima Yojana (PMFBY):** Eligible. Crop insurance coverage for Cotton. (Deadline: August 31, 2026).
3. **GGRC Drip Irrigation Subsidy:** Eligible. Provides 70-90% subsidy for setting up drip irrigation. You are highly recommended to apply.
Use the **Government Schemes** page to check full criteria and launch the mock eligibility checker.`
  }
];

export const mockDefaultChatHistory = [
  { id: "ch-1", title: "Cotton fertilizer scheduling", date: "2026-08-14" },
  { id: "ch-2", title: "Weather query - heavy rain", date: "2026-08-12" },
  { id: "ch-3", title: "PM Kisan installment status", date: "2026-08-10" }
];
