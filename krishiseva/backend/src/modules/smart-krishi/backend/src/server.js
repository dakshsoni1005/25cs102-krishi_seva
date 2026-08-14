const app = require('./app');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5001;

connectDB().catch((err) => {
  console.log(`Database connection fallback active: ${err.message}`);
});

app.listen(PORT, () => {
  console.log(`Smart Krishi Server running in development mode on port ${PORT}`);
});
