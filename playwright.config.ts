import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";

export default defineConfig({
  testDir: "./tests",

  // Max time for a single test
  timeout: 90_000,

  // Default timeout for expect() assertions
  expect: { timeout: 15_000 },

  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    // Ezra's Base URL
    baseURL: process.env.EZRA_BASE_URL || "https://myezra-staging.ezra.com",

    // default timeouts
    actionTimeout: 15_000,       // For clicking action /filling etc.
    navigationTimeout: 30_000,   // For page.goto, navigation etc

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
