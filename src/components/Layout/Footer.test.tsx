import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import Footer from "./Footer";

// ─── Mocks ────────────────────────────────────────────────────────────────────
// Note: toHaveNoViolations and @testing-library/jest-dom are already globally
// extended in src/__tests__/setup.ts — no local expect.extend() needed.

// next/link → plain <a> so href assertions work in JSDOM
jest.mock("next/link", () => {
  const MockLink = ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// HofLogo (named export) → minimal <a> stub; avoids pulling in next/link recursion
jest.mock("./HofLogo", () => ({
  HofLogo: ({
    href,
    className,
  }: {
    href: string;
    className?: string;
    showText?: boolean;
  }) => (
    <a href={href} aria-label="Hochschule Hof Homepage" className={className}>
      HofLogo
    </a>
  ),
}));

// ─── Helper ───────────────────────────────────────────────────────────────────

const renderFooter = () => render(<Footer />);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Footer", () => {
  // ── 1. Grundstruktur ───────────────────────────────────────────────────────

  describe("Grundstruktur", () => {
    it('rendert das <footer>-Landmark-Element mit dem aria-label „Seitenfußzeile"', () => {
      renderFooter();
      expect(
        screen.getByRole("contentinfo", { name: /seitenfußzeile/i }),
      ).toBeInTheDocument();
    });

    it("rendert die Überschrift der Impressum-Spalte als h3-Element", () => {
      renderFooter();
      expect(
        screen.getByRole("heading", { level: 3, name: /^impressum$/i }),
      ).toBeInTheDocument();
    });

    it("rendert die Überschrift der Kontakt-Spalte als h3-Element", () => {
      renderFooter();
      expect(
        screen.getByRole("heading", { level: 3, name: /^kontakt$/i }),
      ).toBeInTheDocument();
    });

    it("rendert die Überschrift der Schnelllinks-Spalte als h3-Element", () => {
      renderFooter();
      expect(
        screen.getByRole("heading", { level: 3, name: /^schnelllinks$/i }),
      ).toBeInTheDocument();
    });

    it("zeigt das HofLogo mit einem Link zur Startseite in der Markenspalte an", () => {
      renderFooter();
      const logoLink = screen.getByRole("link", {
        name: /hochschule hof homepage/i,
      });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("zeigt den Tagline-Text der Markenspalte an", () => {
      renderFooter();
      expect(
        screen.getByText(/die karrieremesse der hochschule hof/i),
      ).toBeInTheDocument();
    });

    it('zeigt den Veranstaltungsnamen „Unternehmerbörse 2026" an', () => {
      renderFooter();
      expect(screen.getByText(/unternehmerbörse 2026/i)).toBeInTheDocument();
    });
  });

  // ── 2. Impressum-Spalte ────────────────────────────────────────────────────

  describe("Impressum-Spalte", () => {
    it("zeigt den vollständigen Namen der Institution an", () => {
      renderFooter();
      // The name appears in both the <address> block and the copyright line
      const matches = screen.getAllByText(
        /hochschule für angewandte wissenschaften hof/i,
      );
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("zeigt die Straße der Institution an", () => {
      renderFooter();
      // Appears in both Impressum address and Kontakt MapPin
      const matches = screen.getAllByText(/alfons-goppel-platz 1/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("zeigt Postleitzahl und Stadt an", () => {
      renderFooter();
      const matches = screen.getAllByText(/95028 hof an der saale/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("zeigt den gesetzlichen Vertreter (Präsident) an", () => {
      renderFooter();
      expect(screen.getByText(/jürgen lehmann/i)).toBeInTheDocument();
    });

    it("zeigt die USt-IdNr. an", () => {
      renderFooter();
      expect(screen.getByText(/DE 237 491 367/)).toBeInTheDocument();
    });

    it("zeigt die zuständige Aufsichtsbehörde an", () => {
      renderFooter();
      expect(
        screen.getByText(/bayerisches staatsministerium/i),
      ).toBeInTheDocument();
    });

    it('enthält einen internen Link zum vollständigen Impressum mit href="/imprint"', () => {
      renderFooter();
      const link = screen.getByRole("link", {
        name: /vollständiges impressum/i,
      });
      expect(link).toHaveAttribute("href", "/imprint");
    });
  });

  // ── 3. Kontakt-Spalte ──────────────────────────────────────────────────────

  describe("Kontakt-Spalte", () => {
    it("rendert einen anklickbaren E-Mail-Link mit korrektem mailto-href", () => {
      renderFooter();
      const mailLink = screen.getByRole("link", {
        name: /unternehmerboerse@hof-university\.de/i,
      });
      expect(mailLink).toHaveAttribute(
        "href",
        "mailto:unternehmerboerse@hof-university.de",
      );
    });

    it("rendert einen anklickbaren Telefon-Link mit korrektem tel-href", () => {
      renderFooter();
      const telLink = screen.getByRole("link", { name: /\+49 9281 306-0/i });
      expect(telLink).toHaveAttribute("href", "tel:+4992813060");
    });

    it('enthält einen Link zum Kontaktformular mit href="/contact"', () => {
      renderFooter();
      const contactLink = screen.getByRole("link", {
        name: /kontaktformular/i,
      });
      expect(contactLink).toHaveAttribute("href", "/contact");
    });
  });

  // ── 4. FooterLink – interne vs. externe Links (Branch-Abdeckung) ───────────

  describe("FooterLink-Komponente", () => {
    describe("interner Link (external nicht gesetzt)", () => {
      it("rendert den Tickets-Link ohne target-Attribut", () => {
        renderFooter();
        const link = screen.getByRole("link", { name: /tickets kaufen/i });
        expect(link).not.toHaveAttribute("target");
      });

      it('rendert den Tickets-Link ohne rel="noopener noreferrer"', () => {
        renderFooter();
        const link = screen.getByRole("link", { name: /tickets kaufen/i });
        expect(link).not.toHaveAttribute("rel", "noopener noreferrer");
      });

      it("rendert den Tickets-Link mit dem korrekten internen href", () => {
        renderFooter();
        expect(
          screen.getByRole("link", { name: /tickets kaufen/i }),
        ).toHaveAttribute("href", "/ticketshop");
      });
    });

    describe("externer Link (external=true)", () => {
      it('rendert den externen HS-Hof-Link mit target="_blank"', () => {
        renderFooter();
        // Exact name match distinguishes this from the HofLogo ("Hochschule Hof Homepage")
        const link = screen.getByRole("link", { name: "Hochschule Hof" });
        expect(link).toHaveAttribute("target", "_blank");
      });

      it('rendert den externen HS-Hof-Link mit rel="noopener noreferrer"', () => {
        renderFooter();
        const link = screen.getByRole("link", { name: "Hochschule Hof" });
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });

      it("rendert den externen HS-Hof-Link mit dem korrekten href", () => {
        renderFooter();
        const link = screen.getByRole("link", { name: "Hochschule Hof" });
        expect(link).toHaveAttribute("href", "https://www.hof-university.de");
      });
    });
  });

  // ── 5. Schnelllinks-Navigation ─────────────────────────────────────────────

  describe("Schnelllinks-Navigation", () => {
    it('rendert eine Navigation mit dem aria-label „Footer-Navigation"', () => {
      renderFooter();
      expect(
        screen.getByRole("navigation", { name: /footer-navigation/i }),
      ).toBeInTheDocument();
    });

    it('enthält den Link „Das Event" mit Anker-href', () => {
      renderFooter();
      expect(screen.getByRole("link", { name: /das event/i })).toHaveAttribute(
        "href",
        "/#event-info",
      );
    });

    it('enthält den Link „Für Aussteller" mit Anker-href', () => {
      renderFooter();
      expect(
        screen.getByRole("link", { name: /für aussteller/i }),
      ).toHaveAttribute("href", "/#exhibitor-info");
    });

    it('enthält den Link „Für Studierende" mit Anker-href', () => {
      renderFooter();
      expect(
        screen.getByRole("link", { name: /für studierende/i }),
      ).toHaveAttribute("href", "/#student-info");
    });
  });

  // ── 6. Rechtliche Leiste (Bottom Bar) ─────────────────────────────────────

  describe("Rechtliche Leiste", () => {
    it("zeigt das aktuelle Copyright-Jahr in der Copyright-Zeile an", () => {
      renderFooter();
      const year = new Date().getFullYear().toString();
      // Anchor to © to avoid colliding with "Unternehmerbörse 2026" which also contains the year
      expect(screen.getByText(new RegExp(`©\\s*${year}`))).toBeInTheDocument();
    });

    it('rendert eine Navigation mit dem aria-label „Rechtliche Links"', () => {
      renderFooter();
      expect(
        screen.getByRole("navigation", { name: /rechtliche links/i }),
      ).toBeInTheDocument();
    });

    it('enthält den Impressum-Link in der rechtlichen Leiste mit href="/imprint"', () => {
      renderFooter();
      const legalNav = screen.getByRole("navigation", {
        name: /rechtliche links/i,
      });
      expect(
        within(legalNav).getByRole("link", { name: /impressum/i }),
      ).toHaveAttribute("href", "/imprint");
    });

    it('enthält den Datenschutz-Link mit href="/privacy"', () => {
      renderFooter();
      const legalNav = screen.getByRole("navigation", {
        name: /rechtliche links/i,
      });
      expect(
        within(legalNav).getByRole("link", { name: /datenschutz/i }),
      ).toHaveAttribute("href", "/privacy");
    });

    it('enthält den Barrierefreiheit-Link mit href="/accessibility"', () => {
      renderFooter();
      const legalNav = screen.getByRole("navigation", {
        name: /rechtliche links/i,
      });
      expect(
        within(legalNav).getByRole("link", { name: /barrierefreiheit/i }),
      ).toHaveAttribute("href", "/accessibility");
    });
  });

  // ── 7. Tastaturbedienung ───────────────────────────────────────────────────

  describe("Tastaturbedienung", () => {
    it("der E-Mail-Link nimmt den Fokus auf und bleibt nach Enter fokussiert", async () => {
      const user = userEvent.setup();
      renderFooter();

      const mailLink = screen.getByRole("link", {
        name: /unternehmerboerse@hof-university\.de/i,
      });
      mailLink.focus();
      expect(document.activeElement).toBe(mailLink);

      // Enter on a link does not throw and keeps focus in JSDOM
      await user.keyboard("{Enter}");
      expect(document.activeElement).toBe(mailLink);
    });

    it("der externe HS-Hof-Link ist per Tastatur fokussierbar", async () => {
      const user = userEvent.setup();
      renderFooter();

      const hofLink = screen.getByRole("link", { name: "Hochschule Hof" });
      hofLink.focus();
      expect(document.activeElement).toBe(hofLink);

      await user.keyboard("{Enter}");
      expect(document.activeElement).toBe(hofLink);
    });

    it("der Impressum-Link in der rechtlichen Leiste ist per Tastatur fokussierbar", async () => {
      const user = userEvent.setup();
      renderFooter();

      const legalNav = screen.getByRole("navigation", {
        name: /rechtliche links/i,
      });
      const imprintLink = within(legalNav).getByRole("link", {
        name: /impressum/i,
      });

      imprintLink.focus();
      expect(document.activeElement).toBe(imprintLink);

      await user.keyboard("{Enter}");
      expect(document.activeElement).toBe(imprintLink);
    });

    it("alle Links im Footer sind <a>-Elemente und somit per Tab erreichbar", () => {
      renderFooter();
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link.tagName).toBe("A");
      });
    });
  });

  // ── 8. Barrierefreiheit (axe) ──────────────────────────────────────────────

  describe("Barrierefreiheit", () => {
    it("hat keine automatisch erkennbaren Barrierefreiheits-Verstöße laut axe", async () => {
      const { container } = renderFooter();
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  // ── 9. Snapshot ────────────────────────────────────────────────────────────

  describe("Snapshot", () => {
    it("entspricht dem gespeicherten Snapshot", () => {
      const { container } = renderFooter();
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
