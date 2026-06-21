import { renderHook, waitFor, act } from '@testing-library/react';
import { useExhibitors, getCompanyCategory } from './useExhibitors';
import * as eventService from '@/services/event.service';
import type { CompanyDto } from '@/types/api.types';

jest.mock('@/services/event.service');

const mockServiceCompanies: CompanyDto[] = [
  {
    companyId: 1,
    name: 'Wilo Pumpen GmbH',
    address: 'Musterweg 1',
    zip: '12345',
    city: 'Hof',
    email: 'wilo@example.com',
    status: 'VERIFIED',
    isSponsor: true,
  },
  {
    companyId: 2,
    name: 'Techniker Krankenkasse',
    address: 'Musterweg 2',
    zip: '12345',
    city: 'Hof',
    email: 'tk@example.com',
    status: 'VERIFIED',
    isSponsor: false,
  },
  {
    companyId: 3,
    name: 'Pending Soft',
    address: 'Musterweg 3',
    zip: '12345',
    city: 'Hof',
    email: 'pending@example.com',
    status: 'PENDING',
    isSponsor: false,
  },
  {
    companyId: 4,
    name: 'SAP Deutschland',
    address: 'Musterweg 4',
    zip: '12345',
    city: 'Hof',
    email: 'sap@example.com',
    status: 'VERIFIED',
    isSponsor: false,
  },
  {
    companyId: 5,
    name: 'HUK-COBURG',
    address: 'Musterweg 5',
    zip: '12345',
    city: 'Hof',
    email: 'huk@example.com',
    status: 'VERIFIED',
    isSponsor: false,
  },
  {
    companyId: 6,
    name: 'DHL Logistik',
    address: 'Musterweg 6',
    zip: '12345',
    city: 'Hof',
    email: 'dhl@example.com',
    status: 'VERIFIED',
    isSponsor: false,
  },
  {
    companyId: 7,
    name: 'Bundeswehr',
    address: 'Musterweg 7',
    zip: '12345',
    city: 'Hof',
    email: 'bundeswehr@example.com',
    status: 'VERIFIED',
    isSponsor: false,
  },
  {
    companyId: 8,
    name: 'Some Random Inc',
    address: 'Musterweg 8',
    zip: '12345',
    city: 'Hof',
    email: 'random@example.com',
    status: 'VERIFIED',
    isSponsor: false,
  },
];

describe('getCompanyCategory', () => {
  it('sollte industry bevorzugen, falls vorhanden', () => {
    const comp = { companyId: 1, name: 'SAP', status: 'VERIFIED', isSponsor: false, industry: 'Custom Industry' } as unknown as CompanyDto;
    expect(getCompanyCategory(comp)).toBe('Custom Industry');
  });

  it('sollte category bevorzugen, falls industry fehlt', () => {
    const comp = { companyId: 1, name: 'SAP', status: 'VERIFIED', isSponsor: false, category: 'Custom Cat' } as unknown as CompanyDto;
    expect(getCompanyCategory(comp)).toBe('Custom Cat');
  });

  it('sollte heuristisch nach Namen filtern', () => {
    expect(getCompanyCategory({ name: 'Wilo SE' } as unknown as CompanyDto)).toBe('Industrie & Maschinenbau');
    expect(getCompanyCategory({ name: 'AOK Bayern' } as unknown as CompanyDto)).toBe('Gesundheitswesen & Soziales');
    expect(getCompanyCategory({ name: 'SAP SE' } as unknown as CompanyDto)).toBe('IT & Software');
    expect(getCompanyCategory({ name: 'HUK-COBURG' } as unknown as CompanyDto)).toBe('Versicherungen & Finanzen');
    expect(getCompanyCategory({ name: 'DHL Express' } as unknown as CompanyDto)).toBe('Logistik & Transport');
    expect(getCompanyCategory({ name: 'Bundeswehr Karriere' } as unknown as CompanyDto)).toBe('Öffentlicher Dienst');
    expect(getCompanyCategory({ name: 'Unbekannt' } as unknown as CompanyDto)).toBe('Sonstige');
  });
});

describe('useExhibitors Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lädt verifizierte Aussteller erfolgreich über die API', async () => {
    (eventService.getExhibitors as jest.Mock).mockResolvedValue({ data: mockServiceCompanies });

    const { result } = renderHook(() => useExhibitors());

    // Wait until the hook has finished fetching the exhibitors
    await waitFor(() => {
      expect(result.current.exhibitors.length).toBe(7);
    });

    // PENDING should be filtered out, so 7 of 8 companies remain
    expect(result.current.exhibitors.some((c) => c.status === 'PENDING')).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('setzt den Fehlerzustand bei fehlgeschlagenem API-Call', async () => {
    const originalEnv = process.env.NODE_ENV;
    // Set to test to trigger non-development error path
    // @ts-expect-error NODE_ENV ist schreibgeschützt in TS-Typdefinitionen
    process.env.NODE_ENV = 'test';
    (eventService.getExhibitors as jest.Mock).mockRejectedValue(new Error('API-Fehler'));

    const { result } = renderHook(() => useExhibitors());

    // Wait until error is populated
    await waitFor(() => {
      expect(result.current.error).toBe('API-Fehler');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.exhibitors).toEqual([]);

    // @ts-expect-error NODE_ENV ist schreibgeschützt in TS-Typdefinitionen
    process.env.NODE_ENV = originalEnv;
  });

  it('filtert Aussteller nach Suchbegriff', async () => {
    (eventService.getExhibitors as jest.Mock).mockResolvedValue({ data: mockServiceCompanies });

    const { result } = renderHook(() => useExhibitors());

    await waitFor(() => {
      expect(result.current.exhibitors.length).toBe(7);
    });

    act(() => {
      result.current.setSearchQuery('SAP');
    });

    expect(result.current.searchQuery).toBe('SAP');
    expect(result.current.filteredExhibitors.length).toBe(1);
    expect(result.current.filteredExhibitors[0].name).toBe('SAP Deutschland');
  });

  it('filtert Aussteller nach Kategorie', async () => {
    (eventService.getExhibitors as jest.Mock).mockResolvedValue({ data: mockServiceCompanies });

    const { result } = renderHook(() => useExhibitors());

    await waitFor(() => {
      expect(result.current.exhibitors.length).toBe(7);
    });

    act(() => {
      result.current.setSelectedCategory('Gesundheitswesen & Soziales');
    });

    expect(result.current.selectedCategory).toBe('Gesundheitswesen & Soziales');
    expect(result.current.filteredExhibitors.length).toBe(1);
    expect(result.current.filteredExhibitors[0].name).toBe('Techniker Krankenkasse');
  });

  it('filtert Aussteller nach Buchstabe', async () => {
    (eventService.getExhibitors as jest.Mock).mockResolvedValue({ data: mockServiceCompanies });

    const { result } = renderHook(() => useExhibitors());

    await waitFor(() => {
      expect(result.current.exhibitors.length).toBe(7);
    });

    act(() => {
      result.current.setSelectedLetter('W');
    });

    expect(result.current.selectedLetter).toBe('W');
    expect(result.current.filteredExhibitors.length).toBe(1);
    expect(result.current.filteredExhibitors[0].name).toBe('Wilo Pumpen GmbH');

    act(() => {
      result.current.setSelectedLetter('0-9');
    });

    expect(result.current.filteredExhibitors.length).toBe(0);
  });

  it('paginiert die Ergebnisse korrekt (6 pro Seite)', async () => {
    (eventService.getExhibitors as jest.Mock).mockResolvedValue({ data: mockServiceCompanies });

    const { result } = renderHook(() => useExhibitors());

    await waitFor(() => {
      expect(result.current.exhibitors.length).toBe(7);
    });

    // There are 7 verified companies in mockServiceCompanies
    expect(result.current.totalCount).toBe(7);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.paginatedExhibitors.length).toBe(6);

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedExhibitors.length).toBe(1);
  });

  it('setzt die Seite zurück auf 1, wenn Filter oder Suche sich ändern', async () => {
    (eventService.getExhibitors as jest.Mock).mockResolvedValue({ data: mockServiceCompanies });

    const { result } = renderHook(() => useExhibitors());

    await waitFor(() => {
      expect(result.current.exhibitors.length).toBe(7);
    });

    act(() => {
      result.current.setCurrentPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.setSearchQuery('SAP');
    });
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.setCurrentPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.setSelectedCategory('IT & Software');
    });
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.setCurrentPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.setSelectedLetter('W');
    });
    expect(result.current.currentPage).toBe(1);
  });

  it('verwaltet die Favoritenliste korrekt', () => {
    const { result } = renderHook(() => useExhibitors());

    expect(result.current.favorites).toEqual([]);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.favorites).toEqual([1]);

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.favorites).toEqual([]);
  });
});
