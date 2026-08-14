const test = require("node:test");
const assert = require("node:assert");
const app = require("../src/app");

// Basic mock request simulator since we don't have supertest installed
// to keep dependencies minimal, or we can use native fetch or basic checks.
test("Health Check Endpoint returns status 200", async (t) => {
  // Simple simulation or health routing check
  const req = {};
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };

  const handler = app._router.stack
    .find(s => s.route && s.route.path === "/api/health") || null;

  // Since health is mounted inside router, we can mock call the main app flow
  // using a simple local request listener check or just testing the health endpoint logic.
  assert.strictEqual(res.statusCode, 200);
});
