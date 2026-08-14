const irrigationRule = require("./irrigation.rule");
const heatStressRule = require("./heatStress.rule");
const pestAlertRule = require("./pestAlert.rule");
const nutrientDeficiencyRule = require("./nutrientDeficiency.rule");

const priorityOrder = {
  critical: 1,
  high: 2,
  medium: 3,
  low: 4
};

const evaluateAllRules = (context) => {
  const rules = [heatStressRule, pestAlertRule, irrigationRule, nutrientDeficiencyRule];
  const results = [];

  for (const rule of rules) {
    try {
      const rec = rule.evaluate(context);
      if (rec) {
        results.push(rec);
      }
    } catch (err) {
      // Ignore evaluation error for single rule
    }
  }

  // Sort by priority order
  results.sort((a, b) => {
    const pA = priorityOrder[a.priority] || 99;
    const pB = priorityOrder[b.priority] || 99;
    return pA - pB;
  });

  return results;
};

module.exports = {
  evaluateAllRules
};
