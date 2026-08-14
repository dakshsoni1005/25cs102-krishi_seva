export const mockMarkets = [
  { id: "m-1", crop: "Cotton", market: "Gondal APMC", location: "Rajkot, Gujarat", minPrice: 6800, maxPrice: 7600, avgPrice: 7200, lastUpdated: "2026-08-14", trend: "up" },
  { id: "m-2", crop: "Cotton", market: "Rajkot APMC", location: "Rajkot, Gujarat", minPrice: 6700, maxPrice: 7550, avgPrice: 7150, lastUpdated: "2026-08-14", trend: "up" },
  { id: "m-3", crop: "Groundnut", market: "Gondal APMC", location: "Rajkot, Gujarat", minPrice: 6200, maxPrice: 7100, avgPrice: 6650, lastUpdated: "2026-08-14", trend: "down" },
  { id: "m-4", crop: "Groundnut", market: "Anand APMC", location: "Anand, Gujarat", minPrice: 6100, maxPrice: 6900, avgPrice: 6500, lastUpdated: "2026-08-13", trend: "flat" },
  { id: "m-5", crop: "Wheat", market: "Ahmedabad APMC", location: "Ahmedabad, Gujarat", minPrice: 2400, maxPrice: 2850, avgPrice: 2625, lastUpdated: "2026-08-14", trend: "up" },
  { id: "m-6", crop: "Wheat", market: "Rajkot APMC", location: "Rajkot, Gujarat", minPrice: 2350, maxPrice: 2800, avgPrice: 2575, lastUpdated: "2026-08-14", trend: "up" },
  { id: "m-7", crop: "Castor", market: "Patan APMC", location: "Patan, Gujarat", minPrice: 5800, maxPrice: 6400, avgPrice: 6100, lastUpdated: "2026-08-14", trend: "down" },
  { id: "m-8", crop: "Castor", market: "Mehsana APMC", location: "Mehsana, Gujarat", minPrice: 5900, maxPrice: 6450, avgPrice: 6175, lastUpdated: "2026-08-13", trend: "flat" },
  { id: "m-9", crop: "Bajra", market: "Deesa APMC", location: "Banaskantha, Gujarat", minPrice: 2100, maxPrice: 2500, avgPrice: 2300, lastUpdated: "2026-08-14", trend: "flat" },
  { id: "m-10", crop: "Paddy", market: "Bavla APMC", location: "Ahmedabad, Gujarat", minPrice: 1850, maxPrice: 2200, avgPrice: 2025, lastUpdated: "2026-08-13", trend: "up" },
  { id: "m-11", crop: "Mustard", market: "Patan APMC", location: "Patan, Gujarat", minPrice: 5100, maxPrice: 5700, avgPrice: 5400, lastUpdated: "2026-08-14", trend: "up" },
  { id: "m-12", crop: "Sesame", market: "Rajkot APMC", location: "Rajkot, Gujarat", minPrice: 11000, maxPrice: 13500, avgPrice: 12250, lastUpdated: "2026-08-14", trend: "up" }
];

export const mockPriceTrends = {
  "Cotton": [
    { month: "Mar", price: 6800 },
    { month: "Apr", price: 6950 },
    { month: "May", price: 7100 },
    { month: "Jun", price: 7050 },
    { month: "Jul", price: 7150 },
    { month: "Aug", price: 7200 }
  ],
  "Groundnut": [
    { month: "Mar", price: 6900 },
    { month: "Apr", price: 6850 },
    { month: "May", price: 6800 },
    { month: "Jun", price: 6720 },
    { month: "Jul", price: 6700 },
    { month: "Aug", price: 6650 }
  ],
  "Wheat": [
    { month: "Mar", price: 2300 },
    { month: "Apr", price: 2420 },
    { month: "May", price: 2500 },
    { month: "Jun", price: 2550 },
    { month: "Jul", price: 2600 },
    { month: "Aug", price: 2625 }
  ],
  "Castor": [
    { month: "Mar", price: 6400 },
    { month: "Apr", price: 6300 },
    { month: "May", price: 6250 },
    { month: "Jun", price: 6200 },
    { month: "Jul", price: 6150 },
    { month: "Aug", price: 6100 }
  ]
};

export const mockWatchlist = ["m-1", "m-3", "m-5"];
