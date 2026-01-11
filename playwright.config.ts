import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: false, // Désactivé pour éviter la surcharge
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 0,
  /* Opt out of parallel tests on CI. */

  // ATTENTION, plusieurs worker peuvent fausser les tests !!! Avec 1 c'est plus lent, mais les tests sont plus fiables.
  workers: 1, // 1 seul worker = tests séquentiels (pas en parallèle)
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // Augmentation des timeouts
    actionTimeout: 60000, // Timeout pour les actions (click, fill…)
    navigationTimeout: 60000, // Timeout pour goto et waitForNavigation
    // Screenshots et vidéos pour déboguer
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Collect trace on first retry
    trace: "on-first-retry",
    baseURL: "http://localhost:3000",
    // headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Forcer le mode headed (avec interface) pour éviter les problèmes de headless
        headless: process.env.CI ? true : false,
      },
    },

    // Firefox activé
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        // Firefox peut être plus lent, on augmente les timeouts
        actionTimeout: 90000,
        navigationTimeout: 90000,
        headless: process.env.CI ? true : false,
      },
    },

    // Quand on active safari, aucun test ne passnt l'etape du btn "paiement sécurisé". Le click est bien présent sur ce btn, maison ne passe pas à l'étape suivante ???
    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //     // Webkit (Safari) peut avoir des comportements différents
    //     actionTimeout: 90000,
    //     navigationTimeout: 90000,
    //     headless: process.env.CI ? true : false,
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */

  // En CI : La variable CI est automatiquement définie par GitHub Actions, et le serveur est déjà lancé par l'étape "Start server in background"
  // En local : CI n'existe pas → Playwright lance automatiquement le serveur avec "pnpm run dev"
  webServer: process.env.CI
    ? undefined
    : {
        command: "pnpm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        ignoreHTTPSErrors: true,
      },
});
