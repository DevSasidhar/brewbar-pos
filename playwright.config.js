import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    reuseExistingServer: true,
    url: 'http://127.0.0.1:5173',
  },
  projects: [
    {
      name: 'tablet-chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1194, height: 834 },
        isMobile: false,
        hasTouch: true,
      },
    },
  ],
})
