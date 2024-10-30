import { Page } from "@playwright/test";

export async function setupStub<T>({
  url,
  json,
  page,
}: {
  url: string;
  json: T;
  page: Page;
}) {
  await page.route(url, async (route) => {
    await route.fulfill({ json });
  });
}
