const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const env = require("./config/env");

// Middlewares
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Router
const apiRouter = require("./routes");

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Logging Middleware
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  // Simple structured log format for production
  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
    )
  );
}

// Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
app.use("/api", apiLimiter);

// Static uploads serving (for leaf image diagnostics previews)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routing Gateway
app.use("/api", apiRouter);

// Fallbacks
app.use(notFound);
app.use(errorHandler);

module.exports = app;
