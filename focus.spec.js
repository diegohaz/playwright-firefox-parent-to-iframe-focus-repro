import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

test.use({
  launchOptions: { executablePath: process.env.FIREFOX_EXECUTABLE_PATH },
});

test('one DOM focus call moves focus from the parent into an iframe', async ({ page }) => {
  await page.setContent(html);
  const inner = page.frameLocator('iframe').locator('#inner');
  await expect(inner).toBeVisible();
  await page.locator('#enter').click();
  console.log(await page.evaluate(() => ({
    parentActiveElement: document.activeElement?.tagName,
    childActiveElement: document.querySelector('iframe').contentDocument.activeElement?.tagName,
  })));
  await expect(inner).toBeFocused();
});
