/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect, Page } from '@playwright/test';

type BaseFixtures = {
    authenticatedPage: Page;
};

export const test = base.extend<BaseFixtures>({
    // TODO: Implement actual session authentication/cookie setup once keycloak/auth API is fully integrated
    authenticatedPage: async ({ page }, use) => {
        await page.goto('/');
        await use(page);
    },
});

export { expect };
