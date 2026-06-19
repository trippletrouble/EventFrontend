import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExhibitorCard } from './ExhibitorCard';
import type { CompanyDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const mockCompany: CompanyDto = {
  companyId: 1,
  name: 'Test GmbH',
  address: 'Musterstraße 1',
  zip: '12345',
  city: 'Musterstadt',
  email: 'info@test-gmbh.de',
  status: 'VERIFIED',
  isSponsor: false,
};

describe('ExhibitorCard', () => {
  it('hat keine A11y-Violations', async () => {
    const { container } = render(
      <div role="list">
        <ExhibitorCard 
          exhibitor={mockCompany} 
          index={0}
          isFavorite={false}
          onToggleFavorite={jest.fn()}
        />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert die Details des Ausstellers korrekt', () => {
    const { container } = render(
      <div role="list">
        <ExhibitorCard 
          exhibitor={mockCompany} 
          index={0}
          isFavorite={false}
          onToggleFavorite={jest.fn()}
        />
      </div>
    );

    expect(screen.getByText('Test GmbH')).toBeInTheDocument();
    expect(screen.getAllByText('Musterstadt').length).toBeGreaterThan(0);
    expect(screen.getAllByText('IT & Software').length).toBeGreaterThan(0);
    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('bg-surface');
    expect(container.querySelector('.bg-primary')).toBeInTheDocument();
  });

  it('zeigt das Sponsor-Styling an, wenn das Unternehmen Sponsor ist', () => {
    const sponsorCompany = { ...mockCompany, isSponsor: true };
    const { container } = render(
      <div role="list">
        <ExhibitorCard 
          exhibitor={sponsorCompany} 
          index={1}
          isFavorite={false}
          onToggleFavorite={jest.fn()}
        />
      </div>
    );

    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('bg-surface-raised');
    expect(container.querySelector('.bg-primary')).toBeInTheDocument();
  });

  it('ruft onToggleFavorite auf, wenn der Stern geklickt wird', () => {
    const toggleMock = jest.fn();
    render(
      <div role="list">
        <ExhibitorCard 
          exhibitor={mockCompany} 
          index={0}
          isFavorite={false}
          onToggleFavorite={toggleMock}
        />
      </div>
    );

    const favButton = screen.getByRole('button', { name: /als Favorit markieren/i });
    fireEvent.click(favButton);
    expect(toggleMock).toHaveBeenCalled();
  });

  it('ruft onCategoryClick auf, wenn das Branchen-Tag geklickt wird', () => {
    const categoryMock = jest.fn();
    render(
      <div role="list">
        <ExhibitorCard 
          exhibitor={mockCompany} 
          index={0}
          isFavorite={false}
          onToggleFavorite={jest.fn()}
          onCategoryClick={categoryMock}
        />
      </div>
    );

    const categoryButton = screen.getAllByRole('button', { name: /IT & Software/i })[0];
    fireEvent.click(categoryButton);
    expect(categoryMock).toHaveBeenCalledWith('IT & Software');
  });
});
