import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
    const { baseURL } = config.projects[0].use;
    console.log(`Playwright global setup: Base URL is ${baseURL}`);
}

export default globalSetup;
