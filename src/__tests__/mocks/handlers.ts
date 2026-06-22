import { http, HttpResponse } from 'msw';
import { mockSession, mockAdmin } from './data/users';
import { mockCompanies, mockCompany } from './data/companies';
import { mockTiers, mockBooking } from './data/bookings';
import { mockEventInfo } from './data/events';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const handlers = [
  // === AUTH ===
  http.get(`${BASE_URL}/auth/session`, () => {
    return HttpResponse.json(mockSession);
  }),

  http.post(`${BASE_URL}/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // === COMPANIES ===
  http.get(`${BASE_URL}/companies/:id`, ({ params }) => {
    const { id } = params;
    const found = mockCompanies.find((c) => String(c.companyId) === String(id)) || mockCompany;
    return HttpResponse.json(found);
  }),

  http.post(`${BASE_URL}/companies`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { ...mockCompany, ...(body as object) },
      { status: 201 }
    );
  }),

  http.patch(`${BASE_URL}/companies/:id`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...mockCompany, ...(body as object) });
  }),

  http.post(`${BASE_URL}/companies/:id/logo-upload-url`, async () => {
    return HttpResponse.json({
      uploadUrl: 'http://localhost:9000/aussteller/mock-logo-upload',
      logoUrl: 'http://localhost:9000/aussteller/mock-logo.png',
    });
  }),

  http.put('http://localhost:9000/aussteller/mock-logo-upload', async () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // === BOOKINGS ===
  http.get(`${BASE_URL}/bookings`, () => {
    return HttpResponse.json({ data: mockTiers });
  }),

  http.post(`${BASE_URL}/bookings`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { ...mockBooking, ...(body as object) },
      { status: 201 }
    );
  }),

  http.post(`${BASE_URL}/bookings/:id/upgrade`, () => {
    return HttpResponse.json({
      priceDifference: 20000,
      paymentUrl: 'https://checkout.stripe.com/upgrade_session_123',
    });
  }),

  http.delete(`${BASE_URL}/bookings`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // === INVITATIONS ===
  http.get(`${BASE_URL}/invitation/:code`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.patch(`${BASE_URL}/invitation/renew`, () => {
    return HttpResponse.json({
      invitationCode: 'renewed-mock-code-999',
    });
  }),

  // === ADMIN ===
  http.get(`${BASE_URL}/admin`, () => {
    return HttpResponse.json([mockAdmin]);
  }),

  http.patch(`${BASE_URL}/admin/promote/:id`, () => {
    return HttpResponse.json({
      ...mockAdmin,
      role: 'ADMIN',
    });
  }),

  http.patch(`${BASE_URL}/admin/demote/:id`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // === PUBLIC EVENTS ===
  http.get(`${BASE_URL}/events/infos`, () => {
    return HttpResponse.json(mockEventInfo);
  }),

  http.get(`${BASE_URL}/events/exhibitors`, () => {
    return HttpResponse.json({ data: mockCompanies });
  }),

  // === PAYMENTS ===
  http.post(`${BASE_URL}/payments/checkout`, () => {
    return HttpResponse.json(
      { checkoutUrl: 'https://checkout.stripe.com/test_session_123' },
      { status: 201 }
    );
  }),
];

