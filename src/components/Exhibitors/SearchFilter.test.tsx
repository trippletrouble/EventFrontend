import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilter } from './SearchFilter';

expect.extend(toHaveNoViolations);

describe('SearchFilter', () => {
  const onSearchChangeMock = jest.fn();
  const onCategoryChangeMock = jest.fn();

  beforeEach(() => {
    onSearchChangeMock.mockClear();
    onCategoryChangeMock.mockClear();
  });

  it('hat keine A11y-Violations', async () => {
    const { container } = render(
      <SearchFilter
        searchQuery=""
        selectedCategory=""
        onSearchChange={onSearchChangeMock}
        onCategoryChange={onCategoryChangeMock}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('ruft onSearchChange nach Debounce auf, wenn Text eingegeben wird', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <SearchFilter
        searchQuery=""
        selectedCategory=""
        onSearchChange={onSearchChangeMock}
        onCategoryChange={onCategoryChangeMock}
      />
    );

    const input = screen.getByPlaceholderText('Firmenname eingeben...');
    await user.type(input, 'Hetzner');

    // Should not have been called immediately
    expect(onSearchChangeMock).not.toHaveBeenCalled();

    // Advance time by 300ms
    jest.advanceTimersByTime(300);

    expect(onSearchChangeMock).toHaveBeenCalledWith('Hetzner');
    jest.useRealTimers();
  });

  it('ruft onCategoryChange sofort auf, wenn eine Kategorie ausgewählt wird', async () => {
    const user = userEvent.setup();
    render(
      <SearchFilter
        searchQuery=""
        selectedCategory=""
        onSearchChange={onSearchChangeMock}
        onCategoryChange={onCategoryChangeMock}
      />
    );

    const select = screen.getByRole('combobox', { name: 'Branche filtern' });
    await user.selectOptions(select, 'IT & Software');

    expect(onCategoryChangeMock).toHaveBeenCalledWith('IT & Software');
  });

  it('zeigt den Löschen-Button nur an, wenn Suchtext vorhanden ist, und löscht bei Klick', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { rerender } = render(
      <SearchFilter
        searchQuery=""
        selectedCategory=""
        onSearchChange={onSearchChangeMock}
        onCategoryChange={onCategoryChangeMock}
      />
    );

    expect(screen.queryByRole('button', { name: 'Suchbegriff löschen' })).not.toBeInTheDocument();

    // Rerender with search text
    rerender(
      <SearchFilter
        searchQuery="Hetzner"
        selectedCategory=""
        onSearchChange={onSearchChangeMock}
        onCategoryChange={onCategoryChangeMock}
      />
    );

    const clearButton = screen.getByRole('button', { name: 'Suchbegriff löschen' });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    jest.advanceTimersByTime(300);

    expect(onSearchChangeMock).toHaveBeenCalledWith('');
    jest.useRealTimers();
  });
});
