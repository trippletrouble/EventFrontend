import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemberList } from './MemberList';
import { mockUser, mockAdmin } from '@/__tests__/mocks/data/users';
import type { UserDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

describe('MemberList', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('hat keine A11y-Violations', async () => {
    const { container } = render(<MemberList members={[mockUser, mockAdmin]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('hat keine A11y-Violations ohne Mitglieder', async () => {
    const { container } = render(<MemberList members={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert die Überschrift', () => {
    render(<MemberList members={[mockUser]} />);
    expect(screen.getByText('Ihre Mitglieder')).toBeInTheDocument();
  });

  it('rendert Mitglieder mit vollem Namen und E-Mail', () => {
    render(<MemberList members={[mockUser]} />);
    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.getByText('max@test.de')).toBeInTheDocument();
  });

  it('zeigt Leermeldung ohne Mitglieder', () => {
    render(<MemberList members={[]} />);
    expect(screen.getByText('Noch keine Mitglieder vorhanden.')).toBeInTheDocument();
  });




  it('sortiert Admins vor normale Nutzer', () => {
    render(<MemberList members={[mockUser, mockAdmin]} />);
    const items = screen.getAllByRole('listitem');
    expect(within(items[0]).getByText('Admin User')).toBeInTheDocument();
    expect(within(items[1]).getByText('Max Mustermann')).toBeInTheDocument();
  });

  it('fällt auf E-Mail zurück wenn Name fehlt', () => {
    const noNameUser: UserDto = {
      userId: 3,
      email: 'anon@test.de',
      role: 'COMPANY_USER',
      firstName: null,
      lastName: null,
    };
    render(<MemberList members={[noNameUser]} />);
    expect(screen.getByText('anon@test.de')).toBeInTheDocument();
  });

  it('zeigt keine zusätzliche E-Mail wenn Name fehlt', () => {
    const noNameUser: UserDto = {
      userId: 3,
      email: 'anon@test.de',
      role: 'COMPANY_USER',
      firstName: null,
      lastName: null,
    };
    render(<MemberList members={[noNameUser]} />);
    const emails = screen.getAllByText('anon@test.de');
    expect(emails).toHaveLength(1);
  });

  it('rendert eine barrierefreie Liste', () => {
    render(<MemberList members={[mockUser]} />);
    expect(screen.getByRole('list', { name: 'Mitgliederliste' })).toBeInTheDocument();
  });

  it('sortiert korrekt wenn beide Nutzer gleiche Rolle haben', () => {
    const user2: UserDto = { userId: 4, firstName: 'Lena', lastName: 'Meier', email: 'lena@test.de', role: 'COMPANY_USER' };
    render(<MemberList members={[mockUser, user2]} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText('Max Mustermann')).toBeInTheDocument();
    expect(within(items[1]).getByText('Lena Meier')).toBeInTheDocument();
  });

  it('rendert ein E-Mail-Icon für jedes Mitglied mit korrektem mailto-Link im Gast-Modus', () => {
    render(<MemberList members={[mockUser]} isWritable={false} companyId={1} />);
    const emailLink = screen.getByRole('link', { name: /E-Mail an Max Mustermann senden/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:max@test.de');
  });

  it('öffnet das Modal zum Hinzufügen eines Ansprechpartners und fügt ihn hinzu', async () => {
    const user = userEvent.setup();
    render(<MemberList members={[]} isWritable={true} companyId={1} />);
    
    // Check that we see the add button
    const addButton = screen.getByRole('button', { name: /Ansprechpartner hinzufügen/i });
    expect(addButton).toBeInTheDocument();
    
    // Click add button
    await user.click(addButton);
    
    // Check modal opens
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Ansprechpartner hinzufügen/i })).toBeInTheDocument();
    
    // Fill in inputs
    const vornameInput = screen.getByLabelText(/Vorname/i);
    const nachnameInput = screen.getByLabelText(/Nachname/i);
    const emailInput = screen.getByLabelText(/E-Mail-Adresse/i);
    
    await user.type(vornameInput, 'Erika');
    await user.type(nachnameInput, 'Mustermann');
    await user.type(emailInput, 'erika@test.de');
    
    // Click submit/add inside modal
    const submitButton = screen.getByRole('button', { name: /^Hinzufügen$/ });
    await user.click(submitButton);
    
    // Verify modal is closed and member is displayed in list
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Erika Mustermann')).toBeInTheDocument();
    expect(screen.getByText('erika@test.de')).toBeInTheDocument();
    
    // Verify that it is stored in localStorage
    const saved = localStorage.getItem('ev_company_added_members_1');
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!)[0].firstName).toBe('Erika');
  });

  it('erlaubt das Löschen eines Ansprechpartners über das Bearbeiten-Modal', async () => {
    const user = userEvent.setup();
    
    // Pre-populate localStorage with a manually added member
    const customMember = { userId: 999, firstName: 'Hans', lastName: 'Dieter', email: 'hans@test.de', role: 'COMPANY_USER' };
    localStorage.setItem('ev_company_added_members_1', JSON.stringify([customMember]));
    
    render(<MemberList members={[mockUser]} isWritable={true} companyId={1} />);
    
    // Both members should be visible
    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.getByText('Hans Dieter')).toBeInTheDocument();
    
    // Click edit on Hans Dieter
    const editButton = screen.getByRole('button', { name: /Ansprechpartner Hans Dieter bearbeiten/i });
    await user.click(editButton);
    
    // Click delete inside edit modal
    const deleteButton = screen.getByRole('button', { name: /Entfernen/i });
    await user.click(deleteButton);
    
    // Hans Dieter should be gone
    expect(screen.queryByText('Hans Dieter')).not.toBeInTheDocument();
    
    // Check localStorage was updated
    const saved = localStorage.getItem('ev_company_added_members_1');
    expect(JSON.parse(saved!)).toHaveLength(0);
  });

  it('rendert LinkedIn-Icon wenn linkedin-Link vorhanden und Gast-Modus aktiv', () => {
    const memberWithLinkedin: UserDto = {
      userId: 10,
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@test.de',
      role: 'COMPANY_USER',
      linkedin: 'https://www.linkedin.com/in/maxmustermann',
    };
    render(<MemberList members={[memberWithLinkedin]} isWritable={false} companyId={1} />);
    const linkedinLink = screen.getByRole('link', { name: /LinkedIn-Profil von Max Mustermann öffnen/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/maxmustermann');
  });

  it('deaktiviert den Hinzufügen-Button wenn das Maximum von 5 Mitgliedern erreicht ist', () => {
    const mockMembers: UserDto[] = Array.from({ length: 5 }, (_, i) => ({
      userId: i + 100,
      firstName: `User ${i}`,
      lastName: 'Test',
      email: `user${i}@test.de`,
      role: 'COMPANY_USER',
    }));
    render(<MemberList members={mockMembers} isWritable={true} companyId={1} />);
    const addButton = screen.getByRole('button', { name: /Ansprechpartner hinzufügen/i });
    expect(addButton).toBeDisabled();
    expect(screen.getByText(/Maximale Anzahl von 5 Ansprechpartnern erreicht/i)).toBeInTheDocument();
  });
});

