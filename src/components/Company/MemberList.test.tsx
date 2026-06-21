import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen, within } from '@testing-library/react';
import { MemberList } from './MemberList';
import { mockUser, mockAdmin } from '@/__tests__/mocks/data/users';
import type { UserDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

describe('MemberList', () => {
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

  it('zeigt die Anzahl der Mitglieder', () => {
    render(<MemberList members={[mockUser, mockAdmin]} />);
    expect(screen.getByText('Anz. 2')).toBeInTheDocument();
  });

  it('zeigt Admin-Badge für Admin-Nutzer', () => {
    render(<MemberList members={[mockAdmin]} />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('zeigt kein Admin-Badge für normale Nutzer', () => {
    render(<MemberList members={[mockUser]} />);
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
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
});
