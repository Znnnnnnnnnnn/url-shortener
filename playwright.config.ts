import { PlaywrightTestConfig, devices } from "@playwright/test";
import path from "path";

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

const config: PlaywrightTestConfig = {
  // Timeout per test
  timeout: 30 * 1000,
  // Test directory
  testDir: path.join(__dirname, "e2e"),

  // Run your local dev server before starting the tests:
  webServer: {
    command: "yarn dev",
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  },

  use: {
    baseURL,
    trace: "retry-with-trace"
  }
};

export default config;
