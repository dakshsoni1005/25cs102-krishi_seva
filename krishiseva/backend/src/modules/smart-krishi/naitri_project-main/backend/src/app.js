const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
const recommendationRoutes = require('./routes/recommendationRoutes');
const districtRoutes = require('./routes/districtRoutes');
const cropRoutes = require('./routes/cropRoutes');
const soilRoutes = require('./routes/soilRoutes');
const fertilizerRoutes = require('./routes/fertilizerRoutes');
const irrigationRoutes = require('./routes/irrigationRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const pestRoutes = require('./routes/pestRoutes');
const cropCalendarRoutes = require('./routes/cropCalendarRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const marketPriceRoutes = require('./routes/marketPriceRoutes');
const governmentAdvisoryRoutes = require('./routes/governmentAdvisoryRoutes');

app.use('/api/recommendations', recommendationRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/fertilizers', fertilizerRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/pests', pestRoutes);
app.use('/api/crop-calendar', cropCalendarRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market-prices', marketPriceRoutes);
app.use('/api/government-advisories', governmentAdvisoryRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
