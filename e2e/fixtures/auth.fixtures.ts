import { test as base, expect, Page } from '@playwright/test';

type BaseFixtures = {
    authenticatedPage: Page;
};

export const test = base.extend<BaseFixtures>({
    authenticatedPage: async ({ page }, use) => {
        await page.goto('/');
        await use(page);
    },
});

export { expect };
