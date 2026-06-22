import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import Footer from "./Footer";

expect.extend(toHaveNoViolations);

// Mocken des Next.js Link-Moduls, um Standard-HTML-Links zu rendern
jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...rest }: { children: React.ReactNode; href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
  MockLink.displayName = "Link";
  return MockLink;
});

// Mocken von next/navigation für eine saubere Testumgebung
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

describe("Footer", () => {
  
  // ─── Struktur & Container ──────────────────────────────────────────────────
  
  it("rendert den Hauptcontainer der Seitenfußzeile mit dem korrekten ARIA-Label", () => {
    render(<Footer />);
    const footerElement = screen.getByRole("contentinfo", { name: "Seitenfußzeile" });
    expect(footerElement).toBeInTheDocument();
  });

  // ─── Spalte 1: Navigation Links ───────────────────────────────────────────

  describe("Navigations-Links", () => {
    it("rendert den Impressum-Link mit dem korrekten Pfad", () => {
      render(<Footer />);
      const imprintLink = screen.getByRole("link", { name: "Impressum" });
      expect(imprintLink).toBeInTheDocument();
      expect(imprintLink).toHaveAttribute("href", "/imprint");
    });

    it("rendert den Datenschutz-Link mit dem korrekten Pfad", () => {
      render(<Footer />);
      const privacyLink = screen.getByRole("link", { name: "Datenschutz" });
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute("href", "/privacy");
    });
  });

  // ─── Spalte 2: Adresse / Kontakt ───────────────────────────────────────────

  describe("Adresse und Hochschule-Informationen", () => {
    it("rendert die Überschrift für den Kontaktbereich", () => {
      render(<Footer />);
      expect(screen.getByRole("heading", { level: 2, name: "Kontakt" })).toBeInTheDocument();
    });

    it("zeigt die vollständigen Adressdaten der Hochschule Hof korrekt an", () => {
      render(<Footer />);
      expect(screen.getByText("Hochschule für angewandte Wissenschaften Hof")).toBeInTheDocument();
      expect(screen.getByText("Veranstaltungsmanagement")).toBeInTheDocument();
      expect(screen.getByText("Alfons-Goppel-Platz 1")).toBeInTheDocument();
      expect(screen.getByText("95028 Hof")).toBeInTheDocument();
    });
  });

  // ─── Spalte 3: E-Mail & Telefon ────────────────────────────────────────────

  describe("Kontaktdetails", () => {
    it("rendert den E-Mail-Link mit dem korrekten mailto-Protokoll", () => {
      render(<Footer />);
      const emailLink = screen.getByRole("link", { name: "info@events.hof-university.de" });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute("href", "mailto:info@events.hof-university.de");
    });

    it("zeigt die korrekten Telefonnummern der Hochschule Hof an", () => {
      render(<Footer />);
      expect(screen.getByText(/Tel\.: 09281 \/ 409 - 3035 \/ 3009/)).toBeInTheDocument();
    });
  });

  // ─── Barrierefreiheit (Accessibility) ──────────────────────────────────────

  describe("Barrierefreiheit", () => {
    it("hat keine Barrierefreiheits-Verletzungen (A11y)", async () => {
      const { container } = render(<Footer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ─── Tastatur-Interaktionen ───────────────────────────────────────────────

  describe("Tastatur-Bedienung", () => {
    it("unterstützt die Tastaturbedienung und Fokussierung aller interaktiven Links in der richtigen Reihenfolge", async () => {
      const user = userEvent.setup();
      render(<Footer />);

      const imprintLink = screen.getByRole("link", { name: "Impressum" });
      const privacyLink = screen.getByRole("link", { name: "Datenschutz" });
      const emailLink = screen.getByRole("link", { name: "info@events.hof-university.de" });

      // Erstes Tabben fokussiert den Impressum-Link
      await user.tab();
      expect(imprintLink).toHaveFocus();

      // Zweites Tabben fokussiert den Datenschutz-Link
      await user.tab();
      expect(privacyLink).toHaveFocus();

      // Drittes Tabben fokussiert den E-Mail-Link
      await user.tab();
      expect(emailLink).toHaveFocus();

      // Viertes Tabben bewegt den Fokus aus dem Footer heraus
      await user.tab();
      expect(imprintLink).not.toHaveFocus();
      expect(privacyLink).not.toHaveFocus();
      expect(emailLink).not.toHaveFocus();
    });
  });
});
