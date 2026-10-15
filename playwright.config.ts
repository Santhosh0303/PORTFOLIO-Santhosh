import { defineConfig, devices } from "@playwright/test";

const base = process.env.BASE_URL ?? "http://localhost:4173";

export default defineConfig({
  testDir: "theme-guard",
  snapshotPathTemplate: "{testDir}/baseline/{projectName}/{arg}{ext}",
  retries: 0,
  reporter: [["list"]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled" } },
  use: {
    baseURL: base,
    colorScheme: "dark",
    reducedMotion: "reduce",
    // Sandboxes without a downloaded browser point this at an installed Chromium.
    ...(process.env.CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.CHROMIUM_PATH } } : {}),
  },
  ...(process.env.BASE_URL
    ? {}
    : { webServer: { command: "node scripts/serve-out.mjs", url: base, reuseExistingServer: true } }),
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "iphone", use: { ...devices["iPhone 14"], browserName: "chromium" } },
  ],
});
