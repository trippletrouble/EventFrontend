import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvitationCode } from './InvitationCode';
import * as invitationService from '@/services/invitation.service';

expect.extend(toHaveNoViolations);

jest.mock('@/services/invitation.service');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('InvitationCode', () => {
  it('hat keine A11y-Violations', async () => {
    const { container } = render(<InvitationCode code="ABC12345" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('hat keine A11y-Violations mit geöffnetem Modal', async () => {
    const user = userEvent.setup();
    render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: /Neuen Code generieren/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('hat keine A11y-Violations mit Fehlermeldung', async () => {
    const user = userEvent.setup();
    render(<InvitationCode code="ABC12345" />);

    jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('fail'));
    await user.click(screen.getByRole('button', { name: 'Code kopieren' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    expect(await axe(document.body)).toHaveNoViolations();
  });

  it('hat keine A11y-Violations im Kopiert-Zustand', async () => {
    const user = userEvent.setup();
    const { container } = render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: 'Code kopieren' }));
    expect(screen.getByRole('status')).toHaveTextContent('Kopiert!');

    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert den Einladungscode und die Überschrift', () => {
    render(<InvitationCode code="ABC12345" />);
    expect(screen.getByText('Einladungscode')).toBeInTheDocument();
    expect(screen.getByText('ABC12345')).toBeInTheDocument();
  });

  it('kopiert den Code in die Zwischenablage', async () => {
    const user = userEvent.setup();
    render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: 'Code kopieren' }));

    expect(screen.getByText('Kopiert!')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Kopiert!');
  });

  it('ändert das aria-label nach dem Kopieren', async () => {
    const user = userEvent.setup();
    render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: 'Code kopieren' }));
    expect(screen.getByRole('button', { name: 'Kopiert' })).toBeInTheDocument();
  });

  it('zeigt Fehlermeldung wenn Kopieren fehlschlägt', async () => {
    const user = userEvent.setup();
    render(<InvitationCode code="ABC12345" />);

    jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('fail'));

    await user.click(screen.getByRole('button', { name: 'Code kopieren' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Code konnte nicht kopiert werden. Bitte markieren und manuell kopieren.');
  });

  it('öffnet den Bestätigungsdialog beim Klick auf Neuen Code generieren', async () => {
    const user = userEvent.setup();
    render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: /Neuen Code generieren/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Einladungscode erneuern?')).toBeInTheDocument();
    expect(screen.getByText(/Der aktuelle Einladungscode wird ungültig/)).toBeInTheDocument();
  });

  it('schließt den Dialog bei Abbrechen', async () => {
    const user = userEvent.setup();
    render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: /Neuen Code generieren/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Abbrechen' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('schließt den Dialog mit Escape', async () => {
    const user = userEvent.setup();
    render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: /Neuen Code generieren/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('erneuert den Code nach Bestätigung', async () => {
    const user = userEvent.setup();
    (invitationService.renewInvitationCode as jest.Mock).mockResolvedValue('NEWCODE99');
    render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: /Neuen Code generieren/i }));
    await user.click(screen.getByRole('button', { name: 'Ja, Code erneuern' }));

    await waitFor(() => {
      expect(screen.getByText('NEWCODE99')).toBeInTheDocument();
    });
    expect(invitationService.renewInvitationCode).toHaveBeenCalled();
  });

  it('zeigt Fehlermeldung wenn Erneuerung fehlschlägt', async () => {
    const user = userEvent.setup();
    (invitationService.renewInvitationCode as jest.Mock).mockRejectedValue(new Error('API error'));
    render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: /Neuen Code generieren/i }));
    await user.click(screen.getByRole('button', { name: 'Ja, Code erneuern' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Code konnte nicht erneuert werden. Bitte versuchen Sie es später erneut.');
    });
  });

  it('zeigt den Lade-Zustand während der Erneuerung', async () => {
    const user = userEvent.setup();
    (invitationService.renewInvitationCode as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: /Neuen Code generieren/i }));
    await user.click(screen.getByRole('button', { name: 'Ja, Code erneuern' }));

    await waitFor(() => {
      expect(screen.getByText('Wird erneuert…')).toBeInTheDocument();
    });
  });

  it('deaktiviert den Erneuern-Button während der Erneuerung', async () => {
    const user = userEvent.setup();
    (invitationService.renewInvitationCode as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<InvitationCode code="ABC12345" />);

    await user.click(screen.getByRole('button', { name: /Neuen Code generieren/i }));
    await user.click(screen.getByRole('button', { name: 'Ja, Code erneuern' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Wird erneuert/i })).toBeDisabled();
    });
  });

  it('löscht vorherige Fehler beim erneuten Kopieren', async () => {
    const user = userEvent.setup();
    render(<InvitationCode code="ABC12345" />);

    const spy = jest.spyOn(navigator.clipboard, 'writeText');
    spy.mockRejectedValueOnce(new Error('fail'));

    await user.click(screen.getByRole('button', { name: 'Code kopieren' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    spy.mockRestore();
    await user.click(screen.getByRole('button', { name: 'Code kopieren' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
