import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import DownloadButton from './DownloadButton';

expect.extend(toHaveNoViolations);

describe('DownloadButton', () => {
  const createdLinks: HTMLAnchorElement[] = [];
  
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
      } as Response)
    );
    
    const originalAppendChild = document.body.appendChild.bind(document.body);
    jest.spyOn(document.body, 'appendChild').mockImplementation((node: Node) => {
      if (node instanceof HTMLAnchorElement) {
        createdLinks.push(node);
      }
      return originalAppendChild(node);
    });
  });
  
  afterEach(() => {
    createdLinks.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
    createdLinks.length = 0;
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('rendert die Komponente mit allen Textelementen korrekt', () => {
      render(<DownloadButton />);
      expect(screen.getByText('Ausstellermappe')).toBeInTheDocument();
      expect(screen.getByText('herunterladen')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i })).toBeInTheDocument();
    });

    it('zeigt initial das Download-Icon an', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.querySelector('circle.opacity-25')).not.toBeInTheDocument();
    });

    it('zeigt initial keine Fehlermeldung an', () => {
      render(<DownloadButton />);
      const errorMessage = screen.queryByText(/fehler/i);
      expect(errorMessage).not.toBeInTheDocument();
    });

    it('hat initial einen aktivierten Button', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      expect(button).not.toBeDisabled();
    });
  });

  describe('Download-Funktionalität', () => {
    it('startet den Download beim Klick auf den Button', async () => {
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);

      await waitFor(() => {
        expect(createdLinks.length).toBeGreaterThan(0);
      });
      const link = createdLinks[0];
      expect(link.href).toContain('/downloads/Ausstellermappe.pdf');
      expect(link.download).toBe('Ausstellermappe.pdf');
    });

    it('setzt den korrekten Download-Pfad', async () => {
      const user = userEvent.setup();
      render(<DownloadButton />);

      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);

      await waitFor(() => {
        expect(createdLinks.length).toBeGreaterThan(0);
      });
      expect(createdLinks[0].href).toContain('/downloads/Ausstellermappe.pdf');
    });

    it('setzt den korrekten Download-Dateinamen', async () => {
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);

      await waitFor(() => {
        expect(createdLinks.length).toBeGreaterThan(0);
      });
      expect(createdLinks[0].download).toBe('Ausstellermappe.pdf');
    });

    it('fügt den Link zum DOM hinzu und entfernt ihn wieder', async () => {
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);

      await waitFor(() => {
        expect(createdLinks.length).toBeGreaterThan(0);
      });
      expect(document.body.appendChild).toHaveBeenCalled();
    });

    it('zeigt während des Downloads den Spinner an', async () => {
      let resolveFetch: (value: Response) => void;
      global.fetch = jest.fn(() => new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }));

      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });

      await user.click(button);

      await waitFor(() => {
        const svg = button.querySelector('svg');
        expect(svg?.querySelector('circle.opacity-25')).toBeInTheDocument();
        expect(svg).toHaveClass('animate-spin');
      });

      resolveFetch!({ ok: true, status: 200 } as Response);
    });

    it('disabled den Button während des Downloads', async () => {
      let resolveFetch: (value: Response) => void;
      global.fetch = jest.fn(() => new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }));

      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });

      expect(button).not.toBeDisabled();

      await user.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });

      resolveFetch!({ ok: true, status: 200 } as Response);

      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });

    it('ändert das aria-label während des Downloads', async () => {
      let resolveFetch: (value: Response) => void;
      global.fetch = jest.fn(() => new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }));

      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });

      expect(button).toHaveAttribute('aria-label', 'Ausstellermappe PDF herunterladen');

      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Ausstellermappe wird heruntergeladen');
      });

      resolveFetch!({ ok: true, status: 200 } as Response);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-label', 'Ausstellermappe PDF herunterladen');
      });
    });
  });

  describe('Fehlerbehandlung', () => {
    it('zeigt eine Fehlermeldung an wenn die Datei nicht verfügbar ist', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      );
      
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Die Ausstellermappe ist derzeit nicht verfügbar.')).toBeInTheDocument();
      });
    });
    
    it('zeigt eine Fehlermeldung an wenn der HEAD-Request fehlschlägt', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        } as Response)
      );
      
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Die Ausstellermappe ist derzeit nicht verfügbar.')).toBeInTheDocument();
      });
    });
    
    it('zeigt eine generische Fehlermeldung bei Netzwerkfehler an', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Fehler beim Download. Bitte versuchen Sie es erneut.')).toBeInTheDocument();
      });
    });
    
    it('zeigt Fehlermeldung mit roter Textfarbe an', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      );
      
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);
      
      await waitFor(() => {
        const errorDiv = screen.getByRole('alert');
        expect(errorDiv).toHaveClass('text-red-500');
      });
    });
    
    it('setzt den Button-Status nach einem Fehler zurück', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      );
      
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });
    
    it('löscht vorherige Fehlermeldungen bei erneutem Download-Versuch', async () => {
      const user = userEvent.setup();
      render(<DownloadButton />);
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      );
      
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText('Die Ausstellermappe ist derzeit nicht verfügbar.')).toBeInTheDocument();
      });
      
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        } as Response)
      );
      
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.queryByText('Die Ausstellermappe ist derzeit nicht verfügbar.')).not.toBeInTheDocument();
      });
    });
    
    it('ruft fetch mit korrekter URL und HEAD-Methode auf', async () => {
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/downloads/Ausstellermappe.pdf', { method: 'HEAD' });
      });
    });
  });

  describe('Tastaturbedienung', () => {
    it('kann mit der Enter-Taste bedient werden', async () => {
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      button.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(createdLinks.length).toBeGreaterThan(0);
      });
    });

    it('kann mit der Leertaste bedient werden', async () => {
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      button.focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(createdLinks.length).toBeGreaterThan(0);
      });
    });

    it('ist fokussierbar mit Tab-Taste', async () => {
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.tab();

      expect(button).toHaveFocus();
    });

    it('hat die korrekten Focus-Styles', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      expect(button).toHaveClass('focus:ring-2');
      expect(button).toHaveClass('focus:ring-[#0AD88E]/50');
      expect(button).toHaveClass('focus:outline-none');
    });
  });

  describe('Styling und visuelle Zustände', () => {
    it('hat die korrekten Hover-Klassen', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      expect(button).toHaveClass('hover:bg-[#0AD88E]');
      expect(button).toHaveClass('hover:text-black');
      expect(button).toHaveClass('hover:scale-105');
    });

    it('hat die korrekten Disabled-Klassen', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      expect(button).toHaveClass('disabled:opacity-40');
      expect(button).toHaveClass('disabled:scale-100');
      expect(button).toHaveClass('disabled:hover:bg-white/5');
      expect(button).toHaveClass('disabled:hover:text-[#0AD88E]');
    });

    it('zeigt den Text in zwei separaten Zeilen an', () => {
      render(<DownloadButton />);
      const textContainer = screen.getByText('Ausstellermappe').parentElement;
      expect(textContainer).toHaveClass('flex');
      expect(textContainer).toHaveClass('flex-col');

      const line1 = screen.getByText('Ausstellermappe');
      const line2 = screen.getByText('herunterladen');
      expect(line1.tagName).toBe('SPAN');
      expect(line2.tagName).toBe('SPAN');
    });

    it('hat die korrekte Farbgebung mit grünem Akzent', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });

      expect(button).toHaveClass('text-[#0AD88E]');
    });

    it('rendert die Layout-Struktur mit korrekten Klassen', () => {
      const { container } = render(<DownloadButton />);

      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toHaveClass('flex', 'flex-col', 'items-start', 'gap-1');

      const innerDiv = outerDiv.firstChild as HTMLElement;
      expect(innerDiv).toHaveClass('flex', 'items-center', 'gap-8', 'group');
    });
  });

  describe('Barrierefreiheit', () => {
    it('hat keine Barrierefreiheits-Verstöße im Basis-Zustand', async () => {
      const { container } = render(<DownloadButton />);
      const results = await axe(container, {
        rules: {
          region: { enabled: false }
        }
      });
      expect(results).toHaveNoViolations();
    });

    it('hat keine Barrierefreiheits-Verstöße bei angezeigter Fehlermeldung', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      );

      const user = userEvent.setup();
      const { container } = render(<DownloadButton />);

      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);

      await waitFor(async () => {
        expect(screen.getByText('Die Ausstellermappe ist derzeit nicht verfügbar.')).toBeInTheDocument();
        const results = await axe(container, {
          rules: {
            region: { enabled: false }
          }
        });
        expect(results).toHaveNoViolations();
      });
    });

    it('hat ein aussagekräftiges aria-label', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      expect(button).toHaveAttribute('aria-label', 'Ausstellermappe PDF herunterladen');
    });

    it('hat den korrekten Button-Typ', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      expect(button).toHaveAttribute('type', 'button');
    });

    it('ist als Button semantisch korrekt', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });

      expect(button.tagName).toBe('BUTTON');
    });

    it('hat eine korrekte role="alert" für Fehlermeldungen', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      );

      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveTextContent('Die Ausstellermappe ist derzeit nicht verfügbar.');
      });
    });
  });

  describe('Edge Cases und Robustheit', () => {
    it('behandelt schnelle aufeinanderfolgende Klicks korrekt', async () => {
      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);
      await user.click(button);
      await user.click(button);

      await waitFor(() => {
        expect(createdLinks.length).toBeGreaterThan(0);
      });
    });

    it('verhindert mehrfache Downloads während ein Download läuft', async () => {
      let resolveFetch: (value: Response) => void;
      global.fetch = jest.fn(() => new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }));

      const user = userEvent.setup();
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });

      await user.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });

      await user.click(button);

      expect(global.fetch).toHaveBeenCalledTimes(1);

      resolveFetch!({ ok: true, status: 200 } as Response);
    });

    it('zeigt Fehlermeldung unterhalb des Buttons an', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      );

      const user = userEvent.setup();
      const { container } = render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);

      await waitFor(() => {
        const errorElement = screen.getByText('Die Ausstellermappe ist derzeit nicht verfügbar.');
        const outerDiv = container.firstChild as HTMLElement;
        expect(outerDiv).toContainElement(errorElement);
      });
    });

    it('setzt Textfarbe während des Downloads auf grau', async () => {
      let resolveFetch: (value: Response) => void;
      global.fetch = jest.fn(() => new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      }));

      const user = userEvent.setup();
      render(<DownloadButton />);
      const textContainer = screen.getByText('Ausstellermappe').parentElement;

      expect(textContainer).toHaveClass('text-gray-300');

      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);

      await waitFor(() => {
        expect(textContainer).toHaveClass('text-gray-500');
      });

      resolveFetch!({ ok: true, status: 200 } as Response);

      await waitFor(() => {
        expect(textContainer).toHaveClass('text-gray-300');
      });
    });
  });

  describe('SVG Icon-Rendering', () => {
    it('zeigt das Download-Icon korrekt an', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });

      const svg = button.querySelector('svg');
      expect(svg).toHaveClass('h-5', 'w-5');

      const path = svg?.querySelector('path');
      expect(path).toHaveAttribute('stroke-linecap', 'round');
      expect(path).toHaveAttribute('stroke-linejoin', 'round');
    });

    it('hat die korrekten SVG-Attribute für Styling', () => {
      render(<DownloadButton />);
      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });

      const svg = button.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });
  });

  describe('Integration und Gesamtverhalten', () => {
    it('funktioniert vollständig von Rendering bis Download', async () => {
      const user = userEvent.setup();
      const { container } = render(<DownloadButton />);

      expect(screen.getByText('Ausstellermappe')).toBeInTheDocument();
      expect(screen.getByText('herunterladen')).toBeInTheDocument();

      const results = await axe(container, {
        rules: {
          region: { enabled: false }
        }
      });
      expect(results).toHaveNoViolations();

      const button = screen.getByRole('button', { name: /ausstellermappe pdf herunterladen/i });
      await user.click(button);

      await waitFor(() => {
        expect(createdLinks.length).toBeGreaterThan(0);
      });
      expect(createdLinks[0].href).toContain('/downloads/Ausstellermappe.pdf');

      expect(screen.queryByText(/fehler/i)).not.toBeInTheDocument();
    });
  });
});