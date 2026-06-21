import { test, expect } from '@playwright/test';

test.describe('Aussteller-Liste E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/aussteller');
  });

  test('sollte die Seite laden und die Ueberschrift sowie das Layout anzeigen', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Unsere Aussteller');
    
    // Verify the list has items
    const listItems = page.locator('[role="listitem"]');
    await expect(listItems.first()).toBeVisible();
  });

  test('sollte nach Ausstellern per Textsuche suchen können', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeVisible();

    // Search for 'SAP'
    await searchInput.fill('SAP');
    
    // Verify results show matching company
    const headers = page.locator('[role="listitem"] h2');
    await expect(headers.first()).toContainText('SAP Deutschland SE');
    
    // Non-matching companies should not be visible
    await expect(page.locator('text=DATEV eG')).not.toBeVisible();
  });

  test('sollte nach Branche (Kategorie) filtern können', async ({ page }) => {
    const select = page.locator('#category-select');
    await expect(select).toBeVisible();

    // Select IT & Software
    await select.selectOption('IT & Software');
    
    // IT & Software should be visible
    await expect(page.locator('[role="listitem"] h2').first()).toBeVisible();

    // Other categories should not be visible (e.g. AOK Bayern is 'Gesundheitswesen & Soziales')
    await expect(page.locator('text=AOK Bayern')).not.toBeVisible();
  });

  test('sollte nach Anfangsbuchstabe filtern können', async ({ page }) => {
    // Click on letter 'D' in the AlphabetFilter
    const letterD = page.locator('button:has-text("D")').first();
    await expect(letterD).toBeVisible();
    await letterD.click();

    // Verified list should show 'DATEV eG' but not 'SAP'
    await expect(page.locator('text=DATEV eG')).toBeVisible();
    await expect(page.locator('text=SAP Deutschland SE')).not.toBeVisible();
  });

  test('sollte den Suchbegriff über das X-Icon löschen können', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('SAP');
    
    // The X icon for text search
    const clearBtn = page.locator('button[aria-label="Suchbegriff löschen"]');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();

    // Reset should clear search input
    await expect(searchInput).toHaveValue('');
  });

  test('sollte bei keinen Ergebnissen die Filter über den globalen Reset-Button zurücksetzen können', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('XYZABC'); // Non-existent company
    
    // Wait until 'Keine Aussteller gefunden' is shown
    await expect(page.locator('text=Keine Aussteller gefunden')).toBeVisible();
    
    // Global reset button should show
    const resetBtn = page.locator('button:has-text("Filter zurücksetzen")');
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();

    // Search input should be cleared
    await expect(searchInput).toHaveValue('');
    
    // Standard list should be visible again
    await expect(page.locator('[role="listitem"]').first()).toBeVisible();
  });

  test('sollte Favoriten markieren können und diese im LocalStorage speichern', async ({ page }) => {
    // Select first favorite star button
    const firstRow = page.locator('[role="listitem"]').first();
    const companyName = await firstRow.locator('h2').textContent();
    const favButton = firstRow.locator('button[aria-label*="markieren"]');
    
    await expect(favButton).toBeVisible();
    await favButton.click();
    
    // Button label should change to represent "entfernen" (remove)
    await expect(firstRow.locator('button[aria-label*="entfernen"]')).toBeVisible();
    
    // Reload page to verify persistence in LocalStorage
    await page.reload();
    
    // Star should still show filled (entfernen)
    const rowAfterReload = page.locator('[role="listitem"]').filter({ hasText: companyName! });
    await expect(rowAfterReload.locator('button[aria-label*="entfernen"]')).toBeVisible();
  });
});
