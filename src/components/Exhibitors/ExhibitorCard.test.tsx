import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
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
    const { container } = render(<ExhibitorCard exhibitor={mockCompany} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert die Details des Ausstellers korrekt', () => {
    render(<ExhibitorCard exhibitor={mockCompany} />);

    expect(screen.getByText('Test GmbH')).toBeInTheDocument();
    expect(screen.getByText('Musterstraße 1, 12345 Musterstadt')).toBeInTheDocument();
    expect(screen.getByText('info@test-gmbh.de')).toBeInTheDocument();
    expect(screen.queryByText('Freunde & Förderer')).not.toBeInTheDocument();
  });

  it('zeigt das Sponsor-Label an, wenn das Unternehmen Sponsor ist', () => {
    const sponsorCompany = { ...mockCompany, isSponsor: true };
    render(<ExhibitorCard exhibitor={sponsorCompany} />);

    expect(screen.getByText('Freunde & Förderer')).toBeInTheDocument();
  });

  it('wendet die richtigen CSS-Klassen für verschiedene Branchen an', () => {
    const categories = [
      { name: 'SAP Deutschland', expectedText: 'IT & Software' },
      { name: 'Wilo Pumpen', expectedText: 'Industrie & Maschinenbau' },
      { name: 'AOK Soziales', expectedText: 'Gesundheitswesen & Soziales' },
      { name: 'HUK-COBURG', expectedText: 'Versicherungen & Finanzen' },
      { name: 'DHL Express', expectedText: 'Logistik & Transport' },
      { name: 'Bundeswehr', expectedText: 'Öffentlicher Dienst' },
      { name: 'Unbekanntes Werk', expectedText: 'Sonstige' },
    ];

    categories.forEach(({ name, expectedText }) => {
      const company = { ...mockCompany, name };
      render(<ExhibitorCard exhibitor={company} />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });
});
