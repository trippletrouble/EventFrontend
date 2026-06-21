import { renderHook, waitFor } from '@testing-library/react';
import { useCompany } from './useCompany';
import * as api from '@/services/api';

jest.mock('@/services/api');

const mockCompanyResponse = {
  companyId: 1,
  name: 'Test GmbH',
  address: 'Teststraße 1',
  zip: '95028',
  city: 'Hof',
  email: 'info@test-gmbh.de',
  status: 'VERIFIED' as const,
  isSponsor: false,
  inviteCode: '12345678',
};

describe('useCompany', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lädt die Firmendaten erfolgreich', async () => {
    (api.apiFetch as jest.Mock).mockResolvedValue(mockCompanyResponse);

    const { result } = renderHook(() => useCompany('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.company).toEqual({ ...mockCompanyResponse, bookings: [] });
    expect(result.current.error).toBeNull();
    expect(api.apiFetch).toHaveBeenCalledWith('/companies/1');
  });

  it('setzt den Fehlerzustand bei fehlgeschlagenem API-Call', async () => {
    (api.apiFetch as jest.Mock).mockRejectedValue(new Error('API Fehler'));

    const { result } = renderHook(() => useCompany('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('API Fehler');
    expect(result.current.company).toBeNull();
  });

  it('fällt auf Mock-Daten zurück im Entwicklungsmodus', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    (api.apiFetch as jest.Mock).mockRejectedValue(new Error('API not available'));

    const { result } = renderHook(() => useCompany('42'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.company).not.toBeNull();
    expect(result.current.company?.companyId).toBe(42);
    expect(result.current.error).toBeNull();

    process.env.NODE_ENV = originalEnv;
  });

  it('zeigt den Ladezustand initial an', () => {
    (api.apiFetch as jest.Mock).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useCompany('1'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.company).toBeNull();
  });

  it('stellt eine refetch-Funktion bereit', async () => {
    (api.apiFetch as jest.Mock).mockResolvedValue(mockCompanyResponse);

    const { result } = renderHook(() => useCompany('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe('function');
  });

  it('setzt einen generischen Fehler wenn kein Error-Objekt geworfen wird', async () => {
    (api.apiFetch as jest.Mock).mockRejectedValue('string error');

    const { result } = renderHook(() => useCompany('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Fehler beim Laden der Firmendaten');
  });
});
