import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('rendert leeres Suchergebnis mit Zurücksetzen-Button', async () => {
    const user = userEvent.setup();
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
    await user.click(resetBtn);

    expect(setSearchQueryMock).toHaveBeenCalledWith('');
    expect(setSelectedCategoryMock).toHaveBeenCalledWith('');
    expect(setSelectedLetterMock).toHaveBeenCalledWith('Alle');
  });

  it('rendert Ausstellerliste und Infinite Scroll korrekt', () => {
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

    render(<ExhibitorsPage />);

    expect(screen.getByText('Test AG')).toBeInTheDocument();

    // Infinite scroll elements
    expect(screen.getByRole('button', { name: 'Mehr laden' })).toBeInTheDocument();
    expect(screen.getByText('1 von 15 Ausstellern geladen.', { exact: false })).toBeInTheDocument();
  });

  it('ruft toggleFavorite auf, wenn auf das Stern-Icon geklickt wird', async () => {
    const user = userEvent.setup();
    const toggleFavoriteMock = jest.fn();

    mockUseExhibitors.mockReturnValue({
      paginatedExhibitors: [mockExhibitor],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalCount: 1,
      searchQuery: '',
      selectedCategory: '',
      selectedLetter: 'Alle',
      favorites: [],
      setSearchQuery: jest.fn(),
      setSelectedCategory: jest.fn(),
      setSelectedLetter: jest.fn(),
      toggleFavorite: toggleFavoriteMock,
      setCurrentPage: jest.fn(),
    });

    render(<ExhibitorsPage />);

    const favBtn = screen.getByRole('button', { name: /als Favorit markieren/i });
    await user.click(favBtn);

    expect(toggleFavoriteMock).toHaveBeenCalledWith(1);
  });

  it('gruppiert Firmen mit Sonderzeichen unter der Kategorie Sonstige', () => {
    const mockSpecialExhibitor = {
      ...mockExhibitor,
      companyId: 2,
      name: '_Special Corp',
    };

    mockUseExhibitors.mockReturnValue({
      paginatedExhibitors: [mockSpecialExhibitor],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalCount: 1,
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

    expect(screen.getByText('Sonstige', { selector: 'div' })).toBeInTheDocument();
    expect(screen.getByText('_Special Corp')).toBeInTheDocument();
  });

  it('gruppiert Firmen mit Ziffern unter der Kategorie 0-9', () => {
    const mockDigitExhibitor = {
      companyId: 3,
      name: '99 Soft',
      address: 'Teststraße 5',
      zip: '12345',
      city: 'Teststadt',
      email: 'test@example.com',
      status: 'VERIFIED',
      isSponsor: true,
    };

    mockUseExhibitors.mockReturnValue({
      paginatedExhibitors: [mockDigitExhibitor],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalCount: 1,
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

    expect(screen.getByText('0-9', { selector: 'div' })).toBeInTheDocument();
    expect(screen.getByText('99 Soft')).toBeInTheDocument();
  });
});

