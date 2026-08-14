export const mockWeather = {
  current: {
    temp: 31,
    humidity: 78,
    windSpeed: 14, // km/h
    windDir: "SW",
    rainProbability: 85,
    condition: "Partly Cloudy", // Sunny, Rain, Cloudy, Stormy, etc.
    uvIndex: 6,
    sunrise: "06:12 AM",
    sunset: "07:05 PM",
    feelsLike: 35
  },
  alerts: [
    {
      id: "w-alert-1",
      type: "rain", // rain, heat, wind
      severity: "high", // high, warning, info
      title: "Heavy Rainfall Alert",
      description: "Heavy thunder showers expected within the next 24 hours (accumulated rain > 50mm).",
      action: "Delay irrigation, ensure clear drainage pathways in your fields, and secure harvested crops in a dry shelter."
    }
  ],
  forecast: [
    { day: "Today", temp: 31, minTemp: 25, condition: "Partly Cloudy", rainProb: 85, icon: "cloud-sun-rain" },
    { day: "Tomorrow", temp: 28, minTemp: 24, condition: "Heavy Rain", rainProb: 95, icon: "cloud-rain" },
    { day: "Mon", temp: 29, minTemp: 24, condition: "Thunderstorms", rainProb: 90, icon: "cloud-lightning" },
    { day: "Tue", temp: 30, minTemp: 25, condition: "Showers", rainProb: 75, icon: "cloud-drizzle" },
    { day: "Wed", temp: 32, minTemp: 26, condition: "Mostly Sunny", rainProb: 20, icon: "sun" },
    { day: "Thu", temp: 33, minTemp: 26, condition: "Sunny", rainProb: 10, icon: "sun" },
    { day: "Fri", temp: 33, minTemp: 27, condition: "Sunny", rainProb: 15, icon: "sun" }
  ]
};
