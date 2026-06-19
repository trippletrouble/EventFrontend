import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExhibitorsPage from './page';
import { useExhibitors } from '@/hooks/useExhibitors';

jest.mock('@/hooks/useExhibitors');
jest.mock('@/components/Layout/Header', () => {
  const MockHeader = () => <header data-testid="mock-header">Header</header>;
  MockHeader.displayName = 'MockHeader';
  return MockHeader;
});

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const mockExhibitor = {
  companyId: 1,
  name: 'Test AG',
  address: 'Teststraße 5',
  zip: '12345',
  city: 'Teststadt',
  email: 'test@example.com',
  status: 'VERIFIED',
  isSponsor: true,
};

describe('ExhibitorsPage', () => {
  const mockUseExhibitors = useExhibitors as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rendert den Ladezustand korrekt', () => {
    mockUseExhibitors.mockReturnValue({
      paginatedExhibitors: [],
      isLoading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      searchQuery: '',
      selectedCategory: '',
      selectedLetter: 'Alle',
      favorites: [],
      setSearchQuery: jest.fn(),
      setSelectedCategory: jest.fn(),
      setSelectedLetter: jest.fn(),
      toggleFavorite: jest.fn(),
      setCurrentPage: jest.fn(),
    });

    render(<ExhibitorsPage />);

    expect(screen.getByLabelText('Aussteller werden geladen')).toBeInTheDocument();
    expect(screen.queryByText('Keine Aussteller gefunden')).not.toBeInTheDocument();
  });

  it('rendert Fehlermeldung bei Fehlern', () => {
    mockUseExhibitors.mockReturnValue({
      paginatedExhibitors: [],
      isLoading: false,
      error: 'Netzwerkfehler',
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      searchQuery: '',
      selectedCategory: '',
      selectedLetter: 'Alle',
      favorites: [],
      setSearchQuery: jest.fn(),
      setSelectedCategory: jest.fn(),
      setSelectedLetter: jest.fn(),
      toggleFavorite: jest.fn(),
      setCurrentPage: jest.fn(),
    });

    render(<ExhibitorsPage />);

    expect(screen.getByText('Netzwerkfehler')).toBeInTheDocument();
  });

  it('rendert leeres Suchergebnis mit Zurücksetzen-Button', () => {
    const setSearchQueryMock = jest.fn();
    const setSelectedCategoryMock = jest.fn();
    const setSelectedLetterMock = jest.fn();

    mockUseExhibitors.mockReturnValue({
      paginatedExhibitors: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      searchQuery: 'NonExistent',
      selectedCategory: 'IT & Software',
      selectedLetter: 'Alle',
      favorites: [],
      setSearchQuery: setSearchQueryMock,
      setSelectedCategory: setSelectedCategoryMock,
      setSelectedLetter: setSelectedLetterMock,
      toggleFavorite: jest.fn(),
      setCurrentPage: jest.fn(),
    });

    render(<ExhibitorsPage />);

    expect(screen.getByText('Keine Aussteller gefunden')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Für deine Suche "NonExistent" in der Kategorie "IT & Software" und Buchstabe "Alle" wurden keine Ergebnisse gefunden./
      )
    ).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: 'Filter zurücksetzen' });
    fireEvent.click(resetBtn);

    expect(setSearchQueryMock).toHaveBeenCalledWith('');
    expect(setSelectedCategoryMock).toHaveBeenCalledWith('');
    expect(setSelectedLetterMock).toHaveBeenCalledWith('Alle');
  });

  it('rendert Ausstellerliste und Pagination korrekt', () => {
    const setCurrentPageMock = jest.fn();

    mockUseExhibitors.mockReturnValue({
      paginatedExhibitors: [mockExhibitor],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 3,
      totalCount: 15,
      searchQuery: '',
      selectedCategory: '',
      selectedLetter: 'Alle',
      favorites: [],
      setSearchQuery: jest.fn(),
      setSelectedCategory: jest.fn(),
      setSelectedLetter: jest.fn(),
      toggleFavorite: jest.fn(),
      setCurrentPage: setCurrentPageMock,
    });

    const { container } = render(<ExhibitorsPage />);

    expect(screen.getByText('Test AG')).toBeInTheDocument();
    expect(container.querySelector('.bg-primary')).toBeInTheDocument();

    // Pagination elements
    expect(screen.getByRole('navigation', { name: 'Aussteller Seitennavigation' })).toBeInTheDocument();
  });
});
