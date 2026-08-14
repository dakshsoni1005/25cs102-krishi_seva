const env = require("../config/env");

const formatLog = (level, message) => {
  const ts = new Date().toISOString();
  return `[${ts}] [${level.toUpperCase()}] ${message}`;
};

const logger = {
  info: (msg) => {
    console.log(formatLog("info", msg));
  },
  warn: (msg) => {
    console.warn(formatLog("warn", msg));
  },
  error: (msg) => {
    console.error(formatLog("error", msg));
  },
  http: (method, url, status, duration) => {
    console.log(formatLog("http", `${method} ${url} - Status: ${status} in ${duration}ms`));
  }
};

module.exports = logger;
