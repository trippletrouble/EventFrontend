import { test, expect } from '@playwright/test';

test.describe('Aussteller-Liste E2E', () => {
  test('sollte die Seite laden und die Überschrift anzeigen', async ({ page }) => {
    await page.goto('/aussteller');
    await expect(page.locator('h1')).toHaveText('Unsere Aussteller');
  });

  test('sollte nach Ausstellern suchen können', async ({ page }) => {
    await page.goto('/aussteller');
    const searchInput = page.locator('#search-input');
    await searchInput.fill('Test GmbH');
    await expect(page.locator('article h2')).toContainText(['Test GmbH']);
  });

  test('sollte nach Branche filtern können', async ({ page }) => {
    await page.goto('/aussteller');
    const select = page.locator('#category-select');
    await select.selectOption('IT & Software');
    await expect(page.locator('article h2')).toContainText(['Test GmbH']);
  });
});
