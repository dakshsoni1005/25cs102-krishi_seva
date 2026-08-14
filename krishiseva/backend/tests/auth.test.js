const test = require("node:test");
const assert = require("node:assert");
const { loginSchema } = require("../src/modules/auth/auth.validation");

test("loginSchema validates 10-digit mobile number", () => {
  const result = loginSchema.safeParse({
    mobileNumber: "9876543210",
    password: "password123"
  });
  assert.strictEqual(result.success, true);
});

test("loginSchema validates email address identifier", () => {
  const result = loginSchema.safeParse({
    email: "farmer@krishiseva.org",
    password: "password123"
  });
  assert.strictEqual(result.success, true);
});

test("loginSchema validates generic identifier field", () => {
  const result = loginSchema.safeParse({
    identifier: "farmer@krishiseva.org",
    password: "password123"
  });
  assert.strictEqual(result.success, true);
});

test("loginSchema rejects missing identifier and mobile and email", () => {
  const result = loginSchema.safeParse({
    password: "password123"
  });
  assert.strictEqual(result.success, false);
});
