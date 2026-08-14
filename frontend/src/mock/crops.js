export const mockCrops = [
  {
    id: "crop-1",
    name: "Cotton",
    variety: "Bt Cotton (BG-II)",
    area: 8.5, // acres
    sowingDate: "2026-06-15",
    currentStage: "Vegetative Growth", // Stage matches one of the timeline keys
    expectedHarvest: "2026-11-20",
    healthStatus: "Good", // Good, Alert, Critical
    pestWarning: false,
    timeline: [
      { stage: "Land Preparation", status: "completed", date: "2026-06-01" },
      { stage: "Sowing", status: "completed", date: "2026-06-15" },
      { stage: "Germination", status: "completed", date: "2026-06-25" },
      { stage: "Vegetative Growth", status: "active", date: "2026-08-15" },
      { stage: "Flowering", status: "upcoming", date: "2026-09-10" },
      { stage: "Fruit/Grain Development", status: "upcoming", date: "2026-10-05" },
      { stage: "Harvest", status: "upcoming", date: "2026-11-20" }
    ],
    tasks: [
      { id: "task-101", title: "Apply nitrogenous top dressing (Urea)", category: "Fertilizer", status: "today", dueDate: "2026-08-15" },
      { id: "task-102", title: "Inspect leaf underside for aphids/whitefly", category: "Pest Control", status: "today", dueDate: "2026-08-15" },
      { id: "task-103", title: "Schedule light irrigation session", category: "Irrigation", status: "upcoming", dueDate: "2026-08-18" },
      { id: "task-104", title: "Manual weeding in Block B", category: "Weeding", status: "upcoming", dueDate: "2026-08-20" },
      { id: "task-105", title: "Deep plowing and soil turning", category: "Land Prep", status: "completed", dateDone: "2026-06-05" },
      { id: "task-106", title: "First weeding cycle", category: "Weeding", status: "completed", dateDone: "2026-07-10" }
    ]
  },
  {
    id: "crop-2",
    name: "Groundnut",
    variety: "GG-20 (Gujarat Groundnut-20)",
    area: 4.0, // acres
    sowingDate: "2026-07-02",
    currentStage: "Germination",
    expectedHarvest: "2026-10-25",
    healthStatus: "Alert",
    pestWarning: true,
    timeline: [
      { stage: "Land Preparation", status: "completed", date: "2026-06-20" },
      { stage: "Sowing", status: "completed", date: "2026-07-02" },
      { stage: "Germination", status: "active", date: "2026-07-15" },
      { stage: "Vegetative Growth", status: "upcoming", date: "2026-08-25" },
      { stage: "Flowering", status: "upcoming", date: "2026-09-15" },
      { stage: "Fruit/Grain Development", status: "upcoming", date: "2026-10-01" },
      { stage: "Harvest", status: "upcoming", date: "2026-10-25" }
    ],
    tasks: [
      { id: "task-201", title: "Scan yellowing leaves with Pest Scanner", category: "Pest Control", status: "today", dueDate: "2026-08-15" },
      { id: "task-202", title: "Apply gypsum for calcium enrichment", category: "Soil Health", status: "upcoming", dueDate: "2026-08-22" },
      { id: "task-203", title: "Pre-emergence herbicide spray", category: "Weeding", status: "completed", dateDone: "2026-07-05" }
    ]
  }
];

export const mockStageGlossary = {
  "Land Preparation": "Preparing the field bed, plowing, and mixing organic manures to ensure aeration and nutrient availability.",
  "Sowing": "Placing seeds in the ground at the correct depth and spacing for optimal germination.",
  "Germination": "The sprout phase when seedlings break through the soil surface (usually 5-10 days post-sowing).",
  "Vegetative Growth": "Rapid stem, leaf, and branch development. Requires high nitrogen and regular soil moisture monitoring.",
  "Flowering": "Bud formation and blooms appear. Crucial stage where water stress can severely reduce crop yield.",
  "Fruit/Grain Development": "Pod or boll formation where seeds mature. Balanced nutrients (phosphorus, potassium) are essential.",
  "Harvest": "Reaping, gathering, and storing the mature crop safely."
};
