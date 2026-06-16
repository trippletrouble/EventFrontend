import { renderHook, waitFor, act } from '@testing-library/react';
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

  it('erstellt eine Buchung erfolgreich', async () => {
    const mockBooking = { bookingId: 10, tierId: 1, companyId: 2 };
    (bookingService.getTiers as jest.Mock).mockResolvedValue({ data: mockTiers });
    (bookingService.createBooking as jest.Mock).mockResolvedValue(mockBooking);

    const { result } = renderHook(() => useTiers(1));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let bookingResult;
    await act(async () => {
      bookingResult = await result.current.createBooking({ tierId: 1, companyId: 2 });
    });

    expect(bookingResult).toEqual(mockBooking);
    expect(bookingService.createBooking).toHaveBeenCalledWith({ tierId: 1, companyId: 2 });
    expect(result.current.error).toBeNull();
  });

  it('setzt Fehlerzustand bei fehlgeschlagener Buchung', async () => {
    (bookingService.getTiers as jest.Mock).mockResolvedValue({ data: mockTiers });
    (bookingService.createBooking as jest.Mock).mockRejectedValue(new Error('Booking failed'));

    const { result } = renderHook(() => useTiers(1));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await expect(
        result.current.createBooking({ tierId: 1, companyId: 2 })
      ).rejects.toThrow('Booking failed');
    });

    expect(result.current.error).toBe('Booking failed');
  });
});
