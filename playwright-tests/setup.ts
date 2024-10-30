import { Page } from "@playwright/test";

export const setupStub =
  <T>({ url, json }: { url: string; json: T }) =>
  async ({ page }: { page: Page }) => {
    await page.route(url, async (route) => {
      await route.fulfill({ json });
    });
  };
