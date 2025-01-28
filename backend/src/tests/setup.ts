import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Set default timeout for all tests
jest.setTimeout(10000);

// Add global test setup here
beforeAll(() => {
  // Setup before all tests
});

afterAll(() => {
  // Cleanup after all tests
});
