import { test, expect } from '@playwright/test';

test.describe('Company Profile E2E', () => {
  let testCompany: any;

  test.beforeEach(async ({ page }) => {
    // Reset test company state before each test
    testCompany = {
      companyId: 1,
      name: 'Test GmbH',
      address: 'Teststraße 1',
      zip: '95028',
      city: 'Hof',
      email: 'info@test-gmbh.de',
      description: 'Beste Testfirma der Welt',
      status: 'VERIFIED',
      isSponsor: false,
      logoUrl: undefined,
      inviteCode: '12345678',
      bookings: [
        {
          bookingId: 10,
          companyId: 1,
          eventId: 1,
          tierId: 1,
          bookedBy: 100,
          status: 'CONFIRMED',
          createdAt: '2026-06-20T12:00:00Z',
          updatedAt: '2026-06-20T12:00:00Z',
        },
      ],
      members: [
        {
          memberId: 1,
          companyId: 1,
          email: 'ceo@test-gmbh.de',
          role: 'OWNER',
          firstName: 'Max',
          lastName: 'Mustermann',
        },
      ],
    };

    // Route API requests to return the mutable in-memory company state
    await page.route('**/companies/1', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(testCompany),
        });
      } else if (method === 'PATCH') {
        const patchData = route.request().postDataJSON();
        testCompany = { ...testCompany, ...patchData };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(testCompany),
        });
      }
    });

    // Route bookings API (Tiers)
    await page.route('**/bookings?eventId=*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              tierId: 1,
              name: 'Basis',
              price: 50000,
              description: 'Basis Paket für Aussteller',
              features: ['Standplatz 6qm', '1 Tische', 'Stromanschluss'],
              available: 10,
            },
          ],
        }),
      });
    });

    // Go to the company page
    await page.goto('/company/1');
  });

  test('sollte die Profildetails korrekt anzeigen', async ({ page }) => {
    // Assert heading and basic details
    await expect(page.locator('h1')).toHaveText('Ihr Firmenprofil');
    await expect(page.locator('h2#company-profile-heading')).toHaveText('Test GmbH');
    await expect(page.locator('text=Verifiziert')).toBeVisible();
    await expect(page.locator('text=Beste Testfirma der Welt')).toBeVisible();

    // Assert address & contact details
    await expect(page.locator('text=Teststraße 1, 95028 Hof')).toBeVisible();
    await expect(page.locator('text=info@test-gmbh.de')).toBeVisible();
  });

  test('sollte die Formular-Validierung beim Bearbeiten prüfen', async ({ page }) => {
    // Click on Edit button
    const editBtn = page.getByRole('button', { name: 'Profil bearbeiten' });
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // Verify fields are pre-populated
    const nameInput = page.getByLabel('Firmenname');
    await expect(nameInput).toHaveValue('Test GmbH');

    // Test: Name required
    await nameInput.fill('');
    const saveBtn = page.getByRole('button', { name: 'Speichern' });
    await saveBtn.click();
    await expect(page.locator('text=Firmenname ist erforderlich.')).toBeVisible();
    await nameInput.fill('Valid Company Name');

    // Test: Address required
    const addressInput = page.getByLabel('Straße & Hausnummer');
    await addressInput.fill('');
    await saveBtn.click();
    await expect(page.locator('text=Adresse ist erforderlich.')).toBeVisible();
    await addressInput.fill('Musterstraße 42');

    // Test: ZIP exactly 5 digits
    const zipInput = page.getByLabel('PLZ');
    await zipInput.fill('1234'); // 4 digits
    await saveBtn.click();
    await expect(page.locator('text=Die Postleitzahl muss genau 5 Ziffern enthalten.')).toBeVisible();
    await zipInput.fill('abcde'); // non-digits
    await saveBtn.click();
    await expect(page.locator('text=Die Postleitzahl muss genau 5 Ziffern enthalten.')).toBeVisible();
    await zipInput.fill('95030'); // valid

    // Test: City required
    const cityInput = page.getByLabel('Ort');
    await cityInput.fill('');
    await saveBtn.click();
    await expect(page.locator('text=Ort ist erforderlich.')).toBeVisible();
    await cityInput.fill('Hof');

    // Test: Invalid Email
    const emailInput = page.getByLabel('E-Mail');
    await emailInput.fill('invalid-email');
    await saveBtn.click();
    await expect(page.locator('text=Bitte geben Sie eine gültige E-Mail-Adresse ein.')).toBeVisible();
  });

  test('sollte Änderungen verwerfen können über den Abbrechen-Button', async ({ page }) => {
    // Click edit
    await page.getByRole('button', { name: 'Profil bearbeiten' }).click();

    // Modify fields
    await page.getByLabel('Firmenname').fill('Andere Firma GmbH');
    await page.getByLabel('Unternehmensbeschreibung').fill('Eine ganz andere Beschreibung');

    // Click Cancel
    await page.getByRole('button', { name: 'Abbrechen' }).click();

    // Assert form is closed and old values are displayed
    await expect(page.getByLabel('Firmenname')).not.toBeVisible();
    await expect(page.locator('h2#company-profile-heading')).toHaveText('Test GmbH');
    await expect(page.locator('text=Beste Testfirma der Welt')).toBeVisible();
  });

  test('sollte Änderungen erfolgreich speichern und anzeigen', async ({ page }) => {
    // Click edit
    await page.getByRole('button', { name: 'Profil bearbeiten' }).click();

    // Fill new values
    await page.getByLabel('Firmenname').fill('Updated Test GmbH');
    await page.getByLabel('Unternehmensbeschreibung').fill('Das ist unsere neue coole Beschreibung');
    await page.getByLabel('Straße & Hausnummer').fill('Neue Str. 123');
    await page.getByLabel('PLZ').fill('95032');
    await page.getByLabel('Ort').fill('Hof Saale');
    await page.getByLabel('E-Mail').fill('new@test-gmbh.de');

    // Save
    await page.getByRole('button', { name: 'Speichern' }).click();

    // Assert form closed and new values are shown
    await expect(page.getByLabel('Firmenname')).not.toBeVisible();
    await expect(page.locator('h2#company-profile-heading')).toHaveText('Updated Test GmbH');
    await expect(page.locator('text=Das ist unsere neue coole Beschreibung')).toBeVisible();
    await expect(page.locator('text=Neue Str. 123, 95032 Hof Saale')).toBeVisible();
    await expect(page.locator('text=new@test-gmbh.de')).toBeVisible();
  });

  test.describe('Logo Upload Workflow', () => {
    test.beforeEach(async ({ page }) => {
      // Enter edit mode
      await page.getByRole('button', { name: 'Profil bearbeiten' }).click();
    });

    test('sollte Fehler anzeigen bei ungültigen Dateien (Format, Größe)', async ({ page }) => {
      // Click change logo button
      const changeLogoBtn = page.getByRole('button', { name: 'Firmenlogo ändern' });
      await expect(changeLogoBtn).toBeVisible();
      await changeLogoBtn.click();

      // Upload text file (invalid type)
      await page.setInputFiles('#logo-file-input', {
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('this is a test text file'),
      });

      // Verify validation error
      await expect(page.locator('text=Ungültiges Format. Erlaubt sind PNG, JPEG, GIF oder SVG.')).toBeVisible();

      // Upload too large image file (simulate 3MB)
      const largeBuffer = Buffer.alloc(3 * 1024 * 1024); // 3MB
      await page.setInputFiles('#logo-file-input', {
        name: 'large_image.png',
        mimeType: 'image/png',
        buffer: largeBuffer,
      });

      // Verify validation error
      await expect(page.locator('text=Die Datei ist zu groß. Maximale Größe ist 2MB.')).toBeVisible();
    });

    test('sollte Logo-Auswahl verwerfen können', async ({ page }) => {
      // Open dropzone
      await page.getByRole('button', { name: 'Firmenlogo ändern' }).click();

      // Select valid file
      await page.setInputFiles('#logo-file-input', {
        name: 'logo.png',
        mimeType: 'image/png',
        buffer: Buffer.from('fake image data'),
      });

      // Assert preview mode
      await expect(page.locator('text=logo.png')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Logo hochladen' })).toBeVisible();

      // Cancel select / discard
      await page.getByRole('button', { name: 'Verwerfen' }).click();

      // Verify logo select dropzone is hidden, goes back to logo status representation
      await expect(page.locator('text=logo.png')).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'Firmenlogo ändern' })).toBeVisible();
    });

    test('sollte ein Logo erfolgreich hochladen', async ({ page }) => {
      // Mock logo upload API calls
      const mockLogoUrl = 'http://localhost:3002/logos/uploaded-logo.png';
      
      await page.route('**/logo-upload-url', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            uploadUrl: 'http://localhost:3002/mock-upload',
            logoUrl: mockLogoUrl,
          }),
        });
      });

      await page.route('**/mock-upload', async (route) => {
        await route.fulfill({
          status: 200,
        });
      });

      // Open dropzone
      await page.getByRole('button', { name: 'Firmenlogo ändern' }).click();

      // Select valid file
      await page.setInputFiles('#logo-file-input', {
        name: 'logo.png',
        mimeType: 'image/png',
        buffer: Buffer.from('fake image data'),
      });

      // Click Upload
      await page.getByRole('button', { name: 'Logo hochladen' }).click();

      // Verify the logo image is rendered on the profile page
      const logoImg = page.locator('img[alt="Test GmbH Logo"]');
      await expect(logoImg).toBeVisible();
      await expect(logoImg).toHaveAttribute('src', mockLogoUrl);
    });
  });
});
