import type { TierDto, BookingDto } from '@/types/api.types';

// ALLE PREISE IN CENTS!
export const mockTiers: TierDto[] = [
  {
    tierId: 1,
    eventId: 1,
    basePrice: 65000,               // 650,00 €
    sponsorDiscountPercent: 15,
    features: ['Messestand 3m²', 'Ausstellerprofil', 'Ganzseitige Anzeige'],
    slotsTotal: 20,
    available: true,
    _links: { self: { href: '/bookings/1' } },
  },
  {
    tierId: 2,
    eventId: 1,
    basePrice: 85000,               // 850,00 €
    sponsorDiscountPercent: 15,
    features: ['Messestand 6m²', 'Ausstellerprofil', 'Ganzseitige Anzeige', 'Premium-Platzierung'],
    slotsTotal: 15,
    available: true,
    _links: { self: { href: '/bookings/2' } },
  },
  {
    tierId: 3,
    eventId: 1,
    basePrice: 120000,              // 1.200,00 €
    sponsorDiscountPercent: 20,
    features: ['Messestand 9m²', 'Ausstellerprofil', 'Ganzseitige Anzeige', 'Premium-Platzierung', 'Logo auf Plakat'],
    slotsTotal: 10,
    available: true,
    _links: { self: { href: '/bookings/3' } },
  },
  {
    tierId: 4,
    eventId: 1,
    basePrice: 150000,              // 1.500,00 €
    sponsorDiscountPercent: 25,
    features: ['Messestand 12m²', 'Ausstellerprofil', 'Doppelseitige Anzeige', 'Premium-Platzierung', 'Logo auf Plakat', 'Keynote-Slot'],
    slotsTotal: 5,
    available: true,
    _links: { self: { href: '/bookings/4' } },
  },
];

export const mockBooking: BookingDto = {
  bookingId: 1,
  companyId: 1,
  eventId: 1,
  tierId: 1,
  bookedBy: 1,
  status: 'PENDING',
  createdAt: '2026-06-11T10:00:00Z',
  updatedAt: '2026-06-11T10:00:00Z',
  _links: {
    self: { href: '/bookings/1' },
    payment: { href: '/payments/checkout' },
    upgrade: { href: '/bookings/1/upgrade' },
  },
};
