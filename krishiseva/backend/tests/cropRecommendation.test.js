const test = require("node:test");
const assert = require("node:assert");
const { getCropsByDistrict, getDatasetRecommendation } = require("../src/modules/smart-krishi/smartKrishi.service");

test("getCropsByDistrict returns specific suitable crops for Rajkot", async () => {
  const res = await getCropsByDistrict("Rajkot");
  assert.strictEqual(res.success, true);
  assert.deepStrictEqual(res.crops, ["Cotton", "Groundnut", "Wheat", "Bajra", "Sesame", "Castor"]);
});

test("getCropsByDistrict returns specific suitable crops for Anand", async () => {
  const res = await getCropsByDistrict("Anand");
  assert.strictEqual(res.success, true);
  assert.deepStrictEqual(res.crops, ["Tobacco", "Paddy", "Wheat", "Cotton", "Groundnut", "Castor"]);
});

test("getCropsByDistrict returns specific suitable crops for Surat", async () => {
  const res = await getCropsByDistrict("Surat");
  assert.strictEqual(res.success, true);
  assert.deepStrictEqual(res.crops, ["Sugarcane", "Paddy", "Cotton", "Wheat"]);
});

test("getDatasetRecommendation generates valid recommendation report for suitable crop", async () => {
  const res = await getDatasetRecommendation({ district: "Rajkot", crop: "Cotton", season: "Kharif" });
  assert.strictEqual(res.success, true);
  assert.ok(res.data);
  assert.strictEqual(res.data.district, "Rajkot");
  assert.strictEqual(res.data.crop, "Cotton");
  assert.ok(res.recommendation.summary.includes("Rajkot"));
});

test("getDatasetRecommendation handles unsuitable crop with warning and suggestion", async () => {
  const res = await getDatasetRecommendation({ district: "Kachchh", crop: "Sugarcane", season: "Kharif" });
  assert.strictEqual(res.success, false);
  assert.strictEqual(res.code, "CROP_NOT_SUITABLE");
  assert.ok(res.recommendedCrops.includes("Castor"));
});
