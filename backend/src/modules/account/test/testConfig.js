// testConfig.js
// A fixed configuration for the Account unit tests, used in place of src/config/index.js.
// The real config reads backend/.env and throws when a variable is missing; the unit tests must
// run on any machine without one, so every suite that imports code reading the config mocks it
// with this object instead. The keys are test-only values, never used outside these tests.
const testConfig = {
  env: "test",
  port: 0,
  databaseUrl: "postgresql://unused-in-unit-tests",
  nicEncryptionKey: Buffer.from("11".repeat(32), "hex"), // 32-byte AES-256 key
  nicIvKey: Buffer.from("22".repeat(32), "hex"), // a different 32-byte HMAC key, as config requires
  firebaseServiceAccountPath: "unused-in-unit-tests.json",
  jwtSecret: "unit-test-jwt-secret",
  publicBaseUrl: "http://localhost:3000",
};

export default testConfig;
