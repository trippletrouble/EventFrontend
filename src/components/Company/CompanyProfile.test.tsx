import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CompanyProfile } from './CompanyProfile';
import { mockCompany, mockPendingCompany, mockSponsorCompany } from '@/__tests__/mocks/data/companies';
import type { CompanyDto } from '@/types/api.types';

jest.mock('@/services/company.service', () => ({
  updateCompany: jest.fn().mockResolvedValue({}),
}));

expect.extend(toHaveNoViolations);

describe('CompanyProfile', () => {
  it('hat keine A11y-Violations', async () => {
    const { container } = render(<CompanyProfile company={mockCompany} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('hat keine A11y-Violations mit Sponsor-Badge', async () => {
    const { container } = render(<CompanyProfile company={mockSponsorCompany} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('hat keine A11y-Violations im Status Abgelehnt', async () => {
    const rejected: CompanyDto = { ...mockCompany, status: 'REJECTED' };
    const { container } = render(<CompanyProfile company={rejected} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert den Firmennamen', () => {
    render(<CompanyProfile company={mockCompany} />);
    expect(screen.getByText('Test GmbH')).toBeInTheDocument();
  });

  it('rendert die vollständige Adresse', () => {
    render(<CompanyProfile company={mockCompany} />);
    expect(screen.getByText('Teststraße 1, 95028 Hof')).toBeInTheDocument();
  });

  it('rendert die E-Mail als mailto-Link', () => {
    render(<CompanyProfile company={mockCompany} />);
    const link = screen.getByRole('link', { name: 'info@test-gmbh.de' });
    expect(link).toHaveAttribute('href', 'mailto:info@test-gmbh.de');
  });

  it('zeigt den Status Verifiziert für VERIFIED', () => {
    render(<CompanyProfile company={mockCompany} />);
    expect(screen.getByText('Verifiziert')).toBeInTheDocument();
  });

  it('zeigt den Status Ausstehend für PENDING', () => {
    render(<CompanyProfile company={mockPendingCompany} />);
    expect(screen.getByText('Ausstehend')).toBeInTheDocument();
  });

  it('zeigt den Status Abgelehnt für REJECTED', () => {
    const rejected: CompanyDto = { ...mockCompany, status: 'REJECTED' };
    render(<CompanyProfile company={rejected} />);
    expect(screen.getByText('Abgelehnt')).toBeInTheDocument();
  });

  it('zeigt das Sponsor-Badge wenn isSponsor', () => {
    render(<CompanyProfile company={mockSponsorCompany} />);
    expect(screen.getByText('Sponsor')).toBeInTheDocument();
  });

  it('zeigt kein Sponsor-Badge wenn kein Sponsor', () => {
    render(<CompanyProfile company={mockCompany} />);
    expect(screen.queryByText('Sponsor')).not.toBeInTheDocument();
  });

  it('verwendet section mit aria-labelledby', () => {
    render(<CompanyProfile company={mockCompany} />);
    const section = screen.getByRole('region', { name: 'Test GmbH' });
    expect(section).toBeInTheDocument();
  });

  it('fällt auf Ausstehend zurück bei unbekanntem Status', () => {
    const unknown: CompanyDto = { ...mockCompany, status: 'UNKNOWN' as CompanyDto['status'] };
    render(<CompanyProfile company={unknown} />);
    expect(screen.getByText('Ausstehend')).toBeInTheDocument();
  });

  it('toggles edit mode when pencil is clicked and allows saving', async () => {
    const user = userEvent.setup();
    const handleUpdate = jest.fn();
    render(<CompanyProfile company={mockCompany} onUpdate={handleUpdate} />);
    
    const editBtn = screen.getByRole('button', { name: /profil bearbeiten/i });
    expect(editBtn).toBeInTheDocument();
    
    await user.click(editBtn);
    
    const nameInput = screen.getByLabelText(/firmenname/i);
    expect(nameInput).toHaveValue(mockCompany.name);
    
    await user.clear(nameInput);
    await user.type(nameInput, 'New Company GmbH');
    
    const saveBtn = screen.getByRole('button', { name: /speichern/i });
    expect(saveBtn).toBeInTheDocument();
    
    await user.click(saveBtn);
    
    expect(handleUpdate).toHaveBeenCalled();
  });

  it('is accessible via keyboard in edit mode', async () => {
    const user = userEvent.setup();
    render(<CompanyProfile company={mockCompany} />);
    
    const editBtn = screen.getByRole('button', { name: /profil bearbeiten/i });
    await user.tab();
    expect(editBtn).toHaveFocus();
    
    await user.keyboard('{Enter}');
    
    const nameInput = screen.getByLabelText(/firmenname/i);
    expect(nameInput).toHaveFocus();
  });
});
