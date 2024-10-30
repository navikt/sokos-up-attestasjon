import { Page } from "@playwright/test";

export async function setupStub<T>({
  uri,
  json,
  page,
}: {
  uri: string;
  json: T;
  page: Page;
}) {
  await page.route(uri, async (route) => {
    await route.fulfill({ json });
  });
}
