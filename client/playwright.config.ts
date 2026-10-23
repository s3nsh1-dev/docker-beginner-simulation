import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // WHERE the journeys live
  testDir: "./e2e",

  // One browser, tests in order — they share one disposable DB,
  // so parallel browsers would trample each other.
  fullyParallel: false,
  workers: 1,

  // If someone commits test.only(), CI must fail loudly,
  // not silently run a fraction of the suite.
  forbidOnly: !!process.env.CI,

  // One retry guards against rare timing flakes; the retry is
  // also when the trace recording gets made (see below).
  retries: 1,

  // One line per test in the terminal — easiest to read while learning.
  reporter: "list",

  use: {
    // THE repoint: every relative page.goto('/api...') in the specs
    // now resolves against the nginx container, not Vite.
    baseURL: "http://localhost:3000",
    trace: "on-first-retry", // record the failing retry for post-mortem
    headless: true, // real engine, no visible window
  },

  projects: [
    {
      name: "chromium",
      // A preset: desktop-sized window, Chrome's user agent.
      // Chromium only keeps the run fast; more browsers is a later choice.
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    // Contract: "make sure http://localhost:3000 answers before testing."
    // Already up (Part 1 muscle memory)? Command skipped.
    // Down? This boots the whole stack, waits for healthchecks, then tests.
    command: "docker compose -f ../docker-compose.test.yml up -d --wait",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000, // 2 min: room for image builds on a cold machine
  },
});
