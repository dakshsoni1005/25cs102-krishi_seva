const fs = require("fs");
const path = require("path");

const SUSPICIOUS_PATTERNS = [
  "mockData",
  "dummyData",
  "demoData",
  "sampleData",
  "fakeData",
  "mock",
  "dummy",
  "demo",
  "fallback"
];

const TARGET_DIRECTORIES = [
  path.join(__dirname, "../frontend/src"),
  path.join(__dirname, "../backend/src")
];

const IGNORE_PATTERNS = [
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "DUMMY_DATA_AUDIT.md",
  "DUMMY_DATA_REMOVAL_REPORT.md",
  "auditDummy.js"
];

let totalMatches = 0;
const results = [];

function scanFile(filePath) {
  if (IGNORE_PATTERNS.some((p) => filePath.includes(p))) return;
  const ext = path.extname(filePath);
  if (![".js", ".jsx", ".ts", ".tsx", ".json"].includes(ext)) return;

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    SUSPICIOUS_PATTERNS.forEach((pattern) => {
      if (line.toLowerCase().includes(pattern.toLowerCase())) {
        totalMatches++;
        results.push({
          file: path.relative(path.join(__dirname, ".."), filePath),
          line: index + 1,
          pattern,
          snippet: line.trim()
        });
      }
    });
  });
}

function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const items = fs.readdirSync(dirPath);
  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_PATTERNS.includes(item)) {
        scanDirectory(fullPath);
      }
    } else {
      scanFile(fullPath);
    }
  });
}

console.log("==========================================");
console.log("   KRISHISEVA DUMMY DATA AUDIT SCANNER    ");
console.log("==========================================\n");

TARGET_DIRECTORIES.forEach((dir) => scanDirectory(dir));

if (results.length === 0) {
  console.log("✅ Zero suspicious dummy/mock patterns found in source code!");
} else {
  console.log(`⚠️ Found ${results.length} occurrences matching audit patterns:\n`);
  results.slice(0, 50).forEach((r) => {
    console.log(`[${r.file}:${r.line}] Matched '${r.pattern}': ${r.snippet}`);
  });
  if (results.length > 50) {
    console.log(`\n... and ${results.length - 50} more occurrences.`);
  }
}

console.log("\n==========================================");
console.log(`Total Audit Occurrences: ${totalMatches}`);
console.log("==========================================");
