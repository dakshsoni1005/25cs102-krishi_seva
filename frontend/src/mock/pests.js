export const mockPests = {
  diseases: [
    {
      id: "disease-1",
      name: "Leaf Blight (Alternaria)",
      confidence: 94,
      severity: "Moderate", // Low, Moderate, High, Severe
      affectedCrop: "Cotton",
      symptoms: [
        "Small, round, brown necrotic spots on leaves.",
        "Concentric rings appear within the leaf spots (target-board appearance).",
        "Yellow halo surrounding the brown necrotic patches.",
        "Premature leaf shedding in severe cases."
      ],
      possibleCause: "Fungal infection triggered by high relative humidity (above 80%) and temperatures between 25-30°C.",
      treatment: {
        chemical: "Spray Mancozeb 75 WP @ 2.5 g/L or Copper Oxychloride @ 3 g/L of water.",
        organic: "Spray Neem Oil (1500 ppm) @ 5ml/L or Pseudomonas fluorescens formulation @ 10g/L."
      },
      prevention: [
        "Use certified disease-free seeds and resistant varieties.",
        "Ensure wide crop spacing to facilitate optimal ventilation and sunlight exposure.",
        "Remove and burn infected crop residues post-harvest to avoid pathogen carryover."
      ]
    },
    {
      id: "disease-2",
      name: "Early Blight",
      confidence: 88,
      severity: "Low",
      affectedCrop: "Tomato / Potato",
      symptoms: [
        "Dark brown spots on older leaves first.",
        "Target-like rings inside spots.",
        "Leaves turn yellow and fall off."
      ],
      possibleCause: "Alternaria solani fungus spreading via water splash and high humidity.",
      treatment: {
        chemical: "Apply Chlorothalonil or Azoxystrobin fungicide according to label directions.",
        organic: "Apply copper soap fungicides or compost tea sprays to suppress fungal spores."
      },
      prevention: [
        "Rotate crops with non-solanaceous varieties for at least 3 years.",
        "Avoid overhead irrigation; water at the base of the crop.",
        "Apply mulch to prevent soil spores from splashing onto lower leaves."
      ]
    },
    {
      id: "disease-3",
      name: "Cotton Aphids (Aphis gossypii)",
      confidence: 91,
      severity: "High",
      affectedCrop: "Cotton",
      symptoms: [
        "Clusters of tiny green/yellow/black insects on tender shoots and under leaves.",
        "Curling, crinkling, and downward cupping of leaves.",
        "Sticky honeydew excretion on leaf surfaces, followed by black sooty mold growth."
      ],
      possibleCause: "Sucking pests multiplying rapidly in dry weather followed by light showers.",
      treatment: {
        chemical: "Spray Imidacloprid 17.8 SL @ 0.3 ml/L or Thiamethoxam 25 WG @ 0.2 g/L.",
        organic: "Release natural predators like Ladybird beetles, or spray 5% Neem Seed Kernel Extract (NSKE)."
      },
      prevention: [
        "Avoid excessive use of nitrogenous fertilizers which attract sucking pests.",
        "Sow cowpea or maize as border/intercrops to harbor beneficial predatory insects.",
        "Install yellow sticky traps (10-15 per acre) to monitor and catch winged aphids."
      ]
    }
  ]
};
