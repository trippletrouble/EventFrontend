'use client';

import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventInfoSectionDefault, { EventInfoSection } from './EventInfoSection';

expect.extend(toHaveNoViolations);

describe('EventInfoSection', () => {
  describe('Barrierefreiheit und Rendering', () => {
    it('hat keine Barrierefreiheitsverletzungen im Standard-Zustand', async () => {
      const { container } = render(<EventInfoSection />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('rendert den Section-Container mit korrektem ID und Data-Attribut', () => {
      const { container } = render(<EventInfoSection />);
      const section = container.querySelector('section#event-info');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('data-navbar', 'dark');
    });

    it('rendert die Hauptüberschrift mit korrektem Inhalt', () => {
      render(<EventInfoSection />);
      const heading = screen.getByRole('heading', {
        name: /Direkt an dem Campus/i
      });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveAttribute('id', 'event-info-heading');
    });

    it('rendert die Überschrift mit tabIndex 0 für Tastaturbedienung', () => {
      render(<EventInfoSection />);
      const heading = screen.getByRole('heading', {
        name: /Direkt an dem Campus/i
      });
      expect(heading).toHaveAttribute('tabIndex', '0');
    });

    it('rendert die Überschrift mit Focus-Ring-Klasse', () => {
      render(<EventInfoSection />);
      const heading = screen.getByRole('heading', {
        name: /Direkt an dem Campus/i
      });
      expect(heading).toHaveClass('focus-ring', 'rounded');
    });

    it('rendert die Veranstaltungsdetail-Liste mit korrektem ARIA-Label', () => {
      render(<EventInfoSection />);
      const list = screen.getByRole('list', {
        name: 'Veranstaltungsdetails'
      });
      expect(list).toBeInTheDocument();
    });

    it('rendert genau drei Listenpunkte mit Veranstaltungsinformationen', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(3);
    });
  });

  describe('Veranstaltungsinformationen', () => {
    it('zeigt den korrekten Veranstaltungsort an', () => {
      render(<EventInfoSection />);
      expect(screen.getByText('Alfons-Goppel-Platz 1, 95028 Hof')).toBeInTheDocument();
    });

    it('zeigt die korrekte Veranstaltungszeit an', () => {
      render(<EventInfoSection />);
      expect(screen.getByText('09:30 – 16:00 Uhr')).toBeInTheDocument();
    });

    it('zeigt die korrekten Parkplatz-Informationen an', () => {
      render(<EventInfoSection />);
      expect(screen.getByText(/Aussteller Parkplatz P4 zwischen B-Gebäude und Gründerzentrum Einstein 1\./)).toBeInTheDocument();
    });

    it('ordnet alle drei Listenpunkte den Informationen zu', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      
      const ortItem = items[0];
      expect(within(ortItem).getByText('Alfons-Goppel-Platz 1, 95028 Hof')).toBeInTheDocument();

      const zeitItem = items[1];
      expect(within(zeitItem).getByText('09:30 – 16:00 Uhr')).toBeInTheDocument();

      const parkItem = items[2];
      expect(within(parkItem).getByText(/Aussteller Parkplatz P4/)).toBeInTheDocument();
    });
  });

  describe('Icons und visuelle Elemente', () => {
    it('rendert das Standort-Icon für die Adresse', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      const firstItem = items[0];
      
      const svg = firstItem.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-6', 'h-6', 'text-primary', 'shrink-0');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('rendert das Uhr-Icon für die Zeit', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      const secondItem = items[1];
      
      const svg = secondItem.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-6', 'h-6', 'text-primary', 'shrink-0');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('rendert das Auto-Icon für den Parkplatz', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      const thirdItem = items[2];
      
      const svg = thirdItem.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('w-6', 'h-6', 'text-primary', 'shrink-0');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Google Maps iFrame', () => {
    it('rendert das Google Maps iFrame-Element', () => {
      const { container } = render(<EventInfoSection />);
      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
    });

    it('hat das korrekte iFrame-Titel-Attribut für Barrierefreiheit', () => {
      const { container } = render(<EventInfoSection />);
      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute(
        'title',
        'Standort Hochschule Hof auf Google Maps'
      );
    });

    it('hat die korrekte Google Maps Embed-URL', () => {
      const { container } = render(<EventInfoSection />);
      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('src');
      
      const src = iframe?.getAttribute('src') || '';
      expect(src).toContain('google.com/maps/embed');
      expect(src).toContain('pb=');
      expect(src).toContain('50.3245465');
      expect(src).toContain('11.9392233');
    });

    it('rendert das iFrame mit voller Breite', () => {
      const { container } = render(<EventInfoSection />);
      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('width', '100%');
    });

    it('rendert das iFrame mit der Höhe von 350px', () => {
      const { container } = render(<EventInfoSection />);
      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('height', '350');
    });

    it('rendert das iFrame ohne Border', () => {
      const { container } = render(<EventInfoSection />);
      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveStyle({ border: 0 });
    });

    it('erlaubt Vollbildmodus für das iFrame', () => {
      const { container } = render(<EventInfoSection />);
      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('allowFullScreen');
    });

    it('setzt das Lazy-Loading-Attribut für Leistungsoptimierung', () => {
      const { container } = render(<EventInfoSection />);
      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('loading', 'lazy');
    });

    it('setzt das Referrer-Policy-Attribut korrekt', () => {
      const { container } = render(<EventInfoSection />);
      const iframe = container.querySelector('iframe');
      expect(iframe).toHaveAttribute('referrerPolicy', 'no-referrer-when-downgrade');
    });

    it('hat einen Container mit korrekten Styling-Klassen um das iFrame', () => {
      const { container } = render(<EventInfoSection />);
      const iframeContainer = container.querySelector('div.rounded-xl');
      expect(iframeContainer).toBeInTheDocument();
      expect(iframeContainer).toHaveClass('rounded-xl', 'overflow-hidden', 'shadow-xl', 'border');
    });
  });

  describe('Tastaturbedienung', () => {
    it('erlaubt die Fokussierung der Hauptüberschrift über Tab-Taste', async () => {
      const user = userEvent.setup();
      render(<EventInfoSection />);

      const heading = screen.getByRole('heading', { name: /Direkt an dem Campus/i });
      expect(heading).not.toHaveFocus();

      await user.tab();
      expect(heading).toHaveFocus();
    });

    it('erlaubt die Fokussierung des ersten Listenpunktes nach der Überschrift', async () => {
      const user = userEvent.setup();
      render(<EventInfoSection />);

      const heading = screen.getByRole('heading', { name: /Direkt an dem Campus/i });
      const items = screen.getAllByRole('listitem');

      await user.tab();
      expect(heading).toHaveFocus();

      await user.tab();
      expect(items[0]).toHaveFocus();
    });

    it('durchläuft alle drei Listenpunkte mit Tab-Taste', async () => {
      const user = userEvent.setup();
      render(<EventInfoSection />);

      const items = screen.getAllByRole('listitem');
      const heading = screen.getByRole('heading', { name: /Direkt an dem Campus/i });

      await user.tab();
      expect(heading).toHaveFocus();

      await user.tab();
      expect(items[0]).toHaveFocus();

      await user.tab();
      expect(items[1]).toHaveFocus();

      await user.tab();
      expect(items[2]).toHaveFocus();
    });

    it('erlaubt Shift+Tab zum Rückwärtsfokussieren', async () => {
      const user = userEvent.setup();
      render(<EventInfoSection />);

      const items = screen.getAllByRole('listitem');

      items[2].focus();
      expect(items[2]).toHaveFocus();
      await user.tab({ shift: true });
      expect(items[1]).toHaveFocus();
    });

    it('alle fokussierbaren Elemente haben Focus-Ring-Klasse', () => {
      render(<EventInfoSection />);

      const heading = screen.getByRole('heading', { name: /Direkt an dem Campus/i });
      expect(heading).toHaveClass('focus-ring');

      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        expect(item).toHaveClass('focus-ring');
      });
    });
  });

  describe('DOM-Struktur und Layout', () => {
    it('rendert einen Grid-Layout mit zwei Spalten auf großen Displays', () => {
      const { container } = render(<EventInfoSection />);
      const grid = container.querySelector('div.grid');
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-12', 'items-center');
    });

    it('rendert den Section mit korrektem Hintergrund und Padding', () => {
      const { container } = render(<EventInfoSection />);
      const section = container.querySelector('section#event-info');
      expect(section).toHaveClass('bg-surface', 'py-16');
    });

    it('hat einen korrekten Max-Width-Container', () => {
      const { container } = render(<EventInfoSection />);
      const maxWidthDiv = container.querySelector('div.max-w-7xl');
      expect(maxWidthDiv).toBeInTheDocument();
      expect(maxWidthDiv).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
    });

    it('hat responsive Padding-Klassen für verschiedene Bildschirmgrößen', () => {
      const { container } = render(<EventInfoSection />);
      const maxWidthDiv = container.querySelector('div.max-w-7xl');
      expect(maxWidthDiv).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    });

    it('rendert die Veranstaltungsinfo-Container mit korrektem Spacing', () => {
      const { container } = render(<EventInfoSection />);
      const infoDiv = container.querySelector('div.space-y-6');
      expect(infoDiv).toBeInTheDocument();
    });

    it('alle Listenpunkte haben korrektes Icon-Spacing', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        expect(item).toHaveClass('flex', 'gap-4');
      });
    });

    it('alle Listenpunkte haben korrektes Padding und Focus-Ring', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        expect(item).toHaveClass('p-1', 'focus-ring', 'rounded');
      });
    });
  });

  describe('Responsive Design', () => {
    it('rendert responsive Überschrift-Größen', () => {
      render(<EventInfoSection />);
      const heading = screen.getByRole('heading', { name: /Direkt an dem Campus/i });
      expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'font-extrabold');
    });

    it('alle Text-Inhalte haben responsive Größen auf mobilen Geräten', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        const span = item.querySelector('span');
        expect(span).toHaveClass('text-sm', 'sm:text-base');
      });
    });

    it('das Grid-Layout ändert sich von 1 zu 2 Spalten', () => {
      const { container } = render(<EventInfoSection />);
      const grid = container.querySelector('div.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    });
  });

  describe('Listenpunkt-Details', () => {
    it('der erste Listenpunkt hat die richtige Icon-Klasse für das Standort-Icon', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      const icons = items[0].querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
      expect(icons[0]).toHaveClass('w-6', 'h-6', 'text-primary');
    });

    it('der zweite Listenpunkt hat die richtige Icon-Klasse für das Uhr-Icon', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      const icons = items[1].querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
      expect(icons[0]).toHaveClass('w-6', 'h-6', 'text-primary');
    });

    it('der dritte Listenpunkt hat die richtige Icon-Klasse für das Auto-Icon', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      const icons = items[2].querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
      expect(icons[0]).toHaveClass('w-6', 'h-6', 'text-primary');
    });

    it('alle Icons haben aria-hidden Attribut', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        const icon = item.querySelector('svg');
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('alle Listenpunkte verwenden `items-start` oder `items-center` Layout', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        expect(item).toHaveClass('flex', 'gap-4');
      });
    });

    it('der Parkplatz-Listenpunkt hat Alignment für Multi-Line-Text', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      const thirdItem = items[2];
      expect(thirdItem).toHaveClass('items-start');
    });
  });

  describe('Text-Styling', () => {
    it('all Text-Inhalte haben korrektes Foreground-Color', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        expect(item).toHaveClass('text-foreground');
      });
    });

    it('alle Text-Spans haben korrekte Opazität', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      const spans = Array.from(items).map(item => item.querySelector('span'));
      spans.forEach(span => {
        expect(span).toHaveClass('text-foreground/90', 'font-light');
      });
    });

    it('die Parkplatz-Information hat korrektes Line-Height für Lesbarkeit', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      const thirdItemSpan = items[2].querySelector('span');
      expect(thirdItemSpan).toHaveClass('leading-relaxed', 'mt-0.5');
    });
  });

  describe('Rendering und Exports', () => {
    it('wird ohne Props korrekt gerendert', () => {
      const { container } = render(<EventInfoSection />);
      const section = container.querySelector('section#event-info');
      expect(section).toBeInTheDocument();
    });

    it('exportiert die Komponente als named Export', () => {
      expect(EventInfoSection).toBeDefined();
      expect(typeof EventInfoSection).toBe('function');
    });

    it('kann als default Export importiert werden', () => {
      expect(EventInfoSectionDefault).toBeDefined();
    });
  });

  describe('Responsive Breakpoints', () => {
    it('rendert correctly auf Mobile (grid-cols-1)', () => {
      const { container } = render(<EventInfoSection />);
      const grid = container.querySelector('div.grid');
      expect(grid).toHaveClass('grid-cols-1');
    });

    it('rendert correctly auf Desktop (md:grid-cols-2)', () => {
      const { container } = render(<EventInfoSection />);
      const grid = container.querySelector('div.grid');
      expect(grid).toHaveClass('md:grid-cols-2');
    });

    it('rendert Icon-Größen konsistent auf allen Breakpoints', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        const icon = item.querySelector('svg');
        expect(icon).toHaveClass('w-6', 'h-6');
      });
    });
  });

  describe('Aria Attribute und Semantik', () => {
    it('rendert semantic HTML mit Section und List-Elementen', () => {
      const { container } = render(<EventInfoSection />);
      const section = container.querySelector('section');
      const list = container.querySelector('ul');
      expect(section).toBeInTheDocument();
      expect(list).toBeInTheDocument();
    });

    it('verwendet aria-labelledby für semantische Struktur', () => {
      const { container } = render(<EventInfoSection />);
      const section = container.querySelector('section#event-info');
      expect(section).toHaveAttribute('aria-labelledby', 'event-info-heading');
    });

    it('alle Icons haben aria-hidden Attribut um sie vom Screen-Reader zu verstecken', () => {
      const { container } = render(<EventInfoSection />);
      const svgs = container.querySelectorAll('svg');
      svgs.forEach(svg => {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('alle Icons haben mt-0.5 Margin für visuelles Alignment', () => {
      const { container } = render(<EventInfoSection />);
      const svgs = container.querySelectorAll('svg');
      svgs.forEach(svg => {
        expect(svg).toHaveClass('mt-0.5');
      });
    });
  });

  describe('Interaktivität und User-Events', () => {
    it('alle fokussier-bars Elemente sind per Klick nicht aktivierbar (da keine onClick-Handler)', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        expect(item).not.toHaveAttribute('onclick');
      });
    });

    it('Überschrift kann fokussiert werden aber ist nicht interaktiv', async () => {
      const user = userEvent.setup();
      render(<EventInfoSection />);

      const heading = screen.getByRole('heading', { name: /Direkt an dem Campus/i });
      await user.tab();
      expect(heading).toHaveFocus();
    });

    it('Listenpunkte, die fokussiert sind, zeigen Visual Feedback', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        item.focus();
        expect(item).toHaveFocus();
        expect(item).toHaveClass('focus-ring');
      });
    });
  });

  describe('Content-Validierung', () => {
    it('rendert exakt den Text "Direkt an dem Campus" in der Überschrift', () => {
      render(<EventInfoSection />);
      expect(screen.getByText(/Direkt an dem Campus/)).toBeInTheDocument();
    });

    it('rendert exakt den Text "der Hochschule." in der Überschrift', () => {
      render(<EventInfoSection />);
      expect(screen.getByText(/der Hochschule\./)).toBeInTheDocument();
    });

    it('enthält keine leeren Listenpunkte', () => {
      render(<EventInfoSection />);
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        expect(item.textContent).not.toBe('');
      });
    });

    it('alle Veranstaltungsinformationen sind im Dokument vorhanden', () => {
      const { container } = render(<EventInfoSection />);
      const content = container.textContent;
      expect(content).toContain('Alfons-Goppel-Platz 1, 95028 Hof');
      expect(content).toContain('09:30 – 16:00 Uhr');
      expect(content).toContain('P4');
    });
  });
});

