import { renderHook, waitFor } from '@testing-library/react';
import { useTiers } from './useTiers';
import * as bookingService from '@/services/booking.service';

jest.mock('@/services/booking.service');

const mockTiers = [
  {
    tierId: 1,
    eventId: 1,
    basePrice: 65000,
    sponsorDiscountPercent: 15,
    features: ['Feature 1'],
    slotsTotal: 10,
    available: true,
  },
];

describe('useTiers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lädt die Pakete erfolgreich', async () => {
    (bookingService.getTiers as jest.Mock).mockResolvedValue({ data: mockTiers });

    const { result } = renderHook(() => useTiers(1));

    await waitFor(() => {
      expect(result.current.tiers).toEqual(mockTiers);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(bookingService.getTiers).toHaveBeenCalledWith(1);
  });

  it('setzt den Fehlerzustand bei fehlgeschlagenem API-Call', async () => {
    (bookingService.getTiers as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useTiers(1));

    await waitFor(() => {
      expect(result.current.error).toBe('API Error');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.tiers).toEqual([]);
  });

  it('ruft getTiers nicht auf, wenn eventId fehlt', () => {
    const { result } = renderHook(() => useTiers(undefined));

    expect(result.current.isLoading).toBe(false);
    expect(bookingService.getTiers).not.toHaveBeenCalled();
  });
});
