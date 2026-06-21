import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import CancelDialog from './CancelDialog';

expect.extend(toHaveNoViolations);

describe('CancelDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirmSuccess = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirmSuccess: mockOnConfirmSuccess,
    bookingId: 123,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({}),
      } as Response)
    );
  });

  afterEach(() => {
    try {
      act(() => {
        jest.runOnlyPendingTimers();
      });
    } catch {
    }
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('rendert den Dialog wenn isOpen true ist', () => {
      render(<CancelDialog {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Buchung stornieren?')).toBeInTheDocument();
      expect(screen.getByText(/möchten sie dieses standpaket wirklich stornieren/i)).toBeInTheDocument();
    });

    it('rendert den Dialog nicht wenn isOpen false ist', () => {
      render(<CancelDialog {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('rendert beide Buttons korrekt', () => {
      render(<CancelDialog {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /abbrechen/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ja, stornieren/i })).toBeInTheDocument();
    });

    it('zeigt initial keine Fehlermeldung an', () => {
      render(<CancelDialog {...defaultProps} />);
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('zeigt initial keinen Toast an', () => {
      render(<CancelDialog {...defaultProps} />);
      
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('hat die korrekten ARIA-Attribute für das Modal', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('hat eine korrekte Überschrift mit ID für aria-labelledby', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const heading = screen.getByText('Buchung stornieren?');
      expect(heading).toHaveAttribute('id', 'modal-title');
    });
  });

  describe('Abbrechen-Button Funktionalität', () => {
    it('ruft onClose beim Klick auf Abbrechen auf', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('hat den Button-Typ button für Abbrechen gesetzt', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      expect(cancelButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Stornieren-Button Funktionalität', () => {
    it('sendet eine PATCH-Anfrage mit korrekter bookingId beim Klick auf Ja, stornieren', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/bookings', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: 123,
          }),
        });
      });
    });

    it('hat den Button-Typ button für Stornieren gesetzt', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      expect(confirmButton).toHaveAttribute('type', 'button');
    });

    it('zeigt einen Spinner während der Anfrage läuft', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                status: 200,
                json: async () => ({}),
              } as Response);
            }, 100);
          })
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      expect(screen.getByText('Wird storniert...')).toBeInTheDocument();
      
      const spinner = screen.getByText('Wird storniert...').previousSibling;
      expect(spinner).toHaveClass('motion-safe:animate-spin');
    });

    it('deaktiviert beide Buttons während der Anfrage läuft', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                status: 200,
                json: async () => ({}),
              } as Response);
            }, 100);
          })
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      
      await user.click(confirmButton);
      
      expect(confirmButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Erfolgreiche Stornierung', () => {
    it('zeigt den Success-Toast nach erfolgreicher Stornierung an', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('Buchung erfolgreich storniert!')).toBeInTheDocument();
      });
    });

    it('ruft onConfirmSuccess und onClose nach 2 Sekunden auf', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
      
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      
      await waitFor(() => {
        expect(mockOnConfirmSuccess).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    it('zeigt das Success-Icon im Toast an', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        const toast = screen.getByRole('status');
        const checkIcon = toast.querySelector('svg path[d="M5 13l4 4L19 7"]');
        expect(checkIcon).toBeInTheDocument();
      });
    });
  });

  describe('Fehlerbehandlung', () => {
    it('zeigt eine Fehlermeldung bei 401 Unauthorized an', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({}),
        } as Response)
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Sie müssen eingeloggt sein, um eine Buchung zu stornieren.')).toBeInTheDocument();
      });
    });

    it('zeigt eine generische Fehlermeldung bei anderen HTTP-Fehlern an', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({}),
        } as Response)
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Die Stornierung konnte nicht durchgeführt werden.')).toBeInTheDocument();
      });
    });

    it('zeigt eine Fehlermeldung bei Netzwerkfehler an', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('zeigt eine generische Fehlermeldung bei unbekanntem Fehler an', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() => Promise.reject('String error'));
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText('Ein unerwarteter Fehler ist aufgetreten.')).toBeInTheDocument();
      });
    });

    it('zeigt das Fehler-Icon in der Fehlermeldung an', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({}),
        } as Response)
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        const warningIcon = alert.querySelector('svg');
        expect(warningIcon).toBeInTheDocument();
        expect(warningIcon).toHaveClass('h-4', 'w-4', 'shrink-0');
      });
    });

    it('aktiviert die Buttons wieder nach einem Fehler', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({}),
        } as Response)
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      
      expect(confirmButton).not.toBeDisabled();
      expect(cancelButton).not.toBeDisabled();
    });

    it('löscht vorherige Fehlermeldungen bei erneutem Versuch', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({}),
        } as Response)
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByText('Sie müssen eingeloggt sein, um eine Buchung zu stornieren.')).toBeInTheDocument();
      });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({}),
        } as Response)
      );
      
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Sie müssen eingeloggt sein, um eine Buchung zu stornieren.')).not.toBeInTheDocument();
      });
    });
  });

  describe('Tastaturbedienung', () => {
    it('kann den Abbrechen-Button mit der Leertaste aktivieren', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      cancelButton.focus();
      
      await user.keyboard(' ');
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('kann den Abbrechen-Button mit Enter aktivieren', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      cancelButton.focus();
      
      await user.keyboard('{Enter}');
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('kann den Stornieren-Button mit der Leertaste aktivieren', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      confirmButton.focus();
      
      await user.keyboard(' ');
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('kann den Stornieren-Button mit Enter aktivieren', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      confirmButton.focus();
      
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('kann mit Tab zwischen den Buttons navigieren', async () => {
      render(<CancelDialog {...defaultProps} />);
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      
      expect(cancelButton).toBeInTheDocument();
      expect(confirmButton).toBeInTheDocument();
      
      cancelButton.focus();
      expect(cancelButton).toHaveFocus();
      
      confirmButton.focus();
      expect(confirmButton).toHaveFocus();
    });

    it('kann mit Shift+Tab rückwärts zwischen den Buttons navigieren', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      
      confirmButton.focus();
      expect(confirmButton).toHaveFocus();
      
      await user.tab({ shift: true });
      expect(cancelButton).toHaveFocus();
    });

        it('schließt den Dialog mit der Escape-Taste', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      await user.keyboard('{Escape}');
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('schließt den Dialog nicht mit Escape während einer Anfrage läuft', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ok: true,
                status: 200,
                json: async () => ({}),
              } as Response);
            }, 100);
          })
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await user.keyboard('{Escape}');
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('implementiert einen Focus Trap innerhalb des Dialogs', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      
      cancelButton.focus();
      expect(cancelButton).toHaveFocus();
      
      confirmButton.focus();
      expect(confirmButton).toHaveFocus();
      
      confirmButton.focus();
      await user.tab();
      expect(cancelButton).toHaveFocus();
    });

    it('hat korrekte Focus-Styles auf dem Abbrechen-Button', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      expect(cancelButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-white/50');
    });

    it('hat korrekte Focus-Styles auf dem Stornieren-Button', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      expect(confirmButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-red-500');
    });
  });

  describe('Styling und visuelle Zustände', () => {
    it('hat die korrekten Hover-Klassen auf dem Abbrechen-Button', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      expect(cancelButton).toHaveClass('hover:text-white', 'hover:bg-white/5');
    });

    it('hat die korrekten Hover-Klassen auf dem Stornieren-Button', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      expect(confirmButton).toHaveClass('hover:bg-red-500');
    });

    it('hat die korrekten Disabled-Klassen auf beiden Buttons', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      
      expect(cancelButton).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
      expect(confirmButton).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    it('zeigt das Overlay mit korrektem Backdrop-Blur an', () => {
      const { container } = render(<CancelDialog {...defaultProps} />);
      
      const overlay = container.querySelector('.fixed.inset-0');
      expect(overlay).toHaveClass('bg-black/60', 'backdrop-blur-sm');
    });

    it('hat motion-safe Klasse für Animation', () => {
      const { container } = render(<CancelDialog {...defaultProps} />);
      
      const overlay = container.querySelector('.fixed.inset-0');
      expect(overlay).toHaveClass('motion-safe:animate-fadeIn');
    });

    it('hat die korrekte Modal-Struktur und Layout-Klassen', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveClass('bg-zinc-900', 'border', 'border-white/10', 'rounded-2xl', 'shadow-2xl');
    });

    it('zeigt die Fehlermeldung mit rotem Styling an', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({}),
        } as Response)
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('bg-red-500/10', 'border-red-500/20', 'text-red-500');
      });
    });

    it('zeigt den Toast mit grünem Akzent an', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        const toast = screen.getByRole('status');
        expect(toast).toHaveClass('border-[#0AD88E]/30');
      });
    });

    it('hat motion-safe Animation auf dem Toast', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        const toast = screen.getByRole('status');
        expect(toast).toHaveClass('motion-safe:animate-slideInRight');
      });
    });

    it('hat verbesserte Touch-Targets mit py-3 und min-h-[44px]', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      
      expect(cancelButton).toHaveClass('py-3', 'min-h-[44px]');
      expect(confirmButton).toHaveClass('py-3', 'min-h-[44px]');
    });

    it('hat focus:ring-offset für besseren Kontrast', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      
      expect(cancelButton).toHaveClass('focus:ring-offset-2', 'focus:ring-offset-zinc-900');
      expect(confirmButton).toHaveClass('focus:ring-offset-2', 'focus:ring-offset-zinc-900');
    });
  });

  describe('Barrierefreiheit', () => {
    it('hat keine Barrierefreiheits-Verstöße im Basis-Zustand', async () => {
      jest.useRealTimers();
      const { container } = render(<CancelDialog {...defaultProps} />);
      
      const results = await axe(container, {
        rules: {
          region: { enabled: false },
        },
      });
      
      expect(results).toHaveNoViolations();
      jest.useFakeTimers();
    });

    it('hat keine Barrierefreiheits-Verstöße mit angezeigter Fehlermeldung', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({}),
        } as Response)
      );
      
      const { container } = render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
        
      const results = await axe(container, {
        rules: {
          region: { enabled: false },
        },
      });
        
      expect(results).toHaveNoViolations();
      jest.useFakeTimers();
    });

    it('hat keine Barrierefreiheits-Verstöße mit angezeigtem Toast', async () => {
      jest.useRealTimers();
      const user = userEvent.setup();
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({}),
        } as Response)
      );
      
      const { container } = render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
      });
        
      const results = await axe(container, {
        rules: {
          region: { enabled: false },
        },
      });
        
      expect(results).toHaveNoViolations();
      jest.useFakeTimers();
    });

      it('hat das korrekte aria-describedby Attribut', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
      
      const description = document.getElementById('modal-description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveTextContent(/möchten sie dieses standpaket wirklich stornieren/i);
    });

    it('hat aria-live auf der Fehlermeldung', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({}),
        } as Response)
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveAttribute('aria-live', 'assertive');
      });
    });

    it('hat aria-live="polite" auf dem Success-Toast', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        const toast = screen.getByRole('status');
        expect(toast).toHaveAttribute('aria-live', 'polite');
        expect(toast).toHaveAttribute('aria-atomic', 'true');
      });
    });

    it('hat aria-hidden="true" auf dekorativen Icons', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: async () => ({}),
        } as Response)
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        const svg = alert.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('hat aussagekräftige Button-Beschriftungen', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      
      expect(cancelButton).toHaveTextContent('Abbrechen');
      expect(confirmButton).toHaveTextContent('Ja, stornieren');
    });

    it('hat semantisch korrekte Button-Elemente', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      
      expect(cancelButton.tagName).toBe('BUTTON');
      expect(confirmButton.tagName).toBe('BUTTON');
    });

    it('hat eine semantisch korrekte Überschrift', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const heading = screen.getByText('Buchung stornieren?');
      expect(heading.tagName).toBe('H3');
    });

    it('hat Touch-Targets von mindestens 44x44px', () => {
      render(<CancelDialog {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /abbrechen/i });
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      
      expect(cancelButton).toHaveClass('min-h-[44px]');
      expect(confirmButton).toHaveClass('min-h-[44px]');
    });
  });

  describe('Edge Cases und Robustheit', () => {
    it('behandelt schnelle aufeinanderfolgende Klicks korrekt', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      
      await user.click(confirmButton);
      await user.click(confirmButton);
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });

    it('verwendet die korrekte bookingId aus den Props', async () => {
      const user = userEvent.setup({ delay: null });
      render(<CancelDialog {...defaultProps} bookingId={999} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/bookings', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: 999,
          }),
        });
      });
    });

    it('zeigt den Toast nicht an wenn der Request fehlschlägt', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({}),
        } as Response)
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('ruft onConfirmSuccess und onClose nicht auf wenn der Request fehlschlägt', async () => {
      const user = userEvent.setup({ delay: null });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({}),
        } as Response)
      );
      
      render(<CancelDialog {...defaultProps} />);
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      expect(mockOnConfirmSuccess).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Integration und Gesamtverhalten', () => {
    it('funktioniert vollständig von Rendering bis erfolgreicher Stornierung', async () => {
      jest.useRealTimers();

      const localOnClose = jest.fn();
      const localOnConfirmSuccess = jest.fn();
      const localProps = {
        isOpen: true,
        onClose: localOnClose,
        onConfirmSuccess: localOnConfirmSuccess,
        bookingId: 123,
      };
      
      const user = userEvent.setup();
      const { container } = render(<CancelDialog {...localProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Buchung stornieren?')).toBeInTheDocument();
      
      const results = await axe(container, {
        rules: {
          region: { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
      
      const confirmButton = screen.getByRole('button', { name: /ja, stornieren/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText('Buchung erfolgreich storniert!')).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(localOnConfirmSuccess).toHaveBeenCalledTimes(1);
        expect(localOnClose).toHaveBeenCalledTimes(1);
      }, { timeout: 3000 });
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      
      jest.useFakeTimers();
    });
  });
});

