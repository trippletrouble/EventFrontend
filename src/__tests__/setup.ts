import './polyfills';
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { server } from './mocks/server';

// jest-axe global verfügbar machen
expect.extend(toHaveNoViolations);

// MSW Server-Lifecycle
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
