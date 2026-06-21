import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import ExhibitorBenefitsSection from "@/components/Landing/ExhibitorBenefitsSection";

// Jest axe Barrierefreiheitsprüfung erweitern
expect.extend(toHaveNoViolations);

// Next.js Router und Navigation sauber mocken
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("ExhibitorBenefitsSection-Komponente", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("rendert die Komponente initial mit den Standardtiteln korrekt.", () => {
    render(<ExhibitorBenefitsSection />);

    // Hauptüberschrift (level 2) prüfen
    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: "Infos für Aussteller",
    });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveAttribute("tabindex", "0");

    // Unterüberschrift (level 3) prüfen
    const subHeading = screen.getByRole("heading", {
      level: 3,
      name: "Ihre Messeauftritt.",
    });
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveAttribute("tabindex", "0");

    const section = mainHeading.closest("section");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("id", "exhibitor-benefits");
    expect(section).toHaveAttribute("data-navbar", "dark");
  });

  it("rendert die Komponente mit benutzerdefinierten Titeln korrekt.", () => {
    const customMainTitle = "Messe Infos";
    const customSubTitle = "Warum dabei sein?";
    render(
      <ExhibitorBenefitsSection
        mainTitle={customMainTitle}
        title={customSubTitle}
      />,
    );

    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: customMainTitle,
    });
    expect(mainHeading).toBeInTheDocument();

    const subHeading = screen.getByRole("heading", {
      level: 3,
      name: customSubTitle,
    });
    expect(subHeading).toBeInTheDocument();
  });

  it("wendet die übergebene CSS-Klasse (className) korrekt auf das Section-Element an.", () => {
    const customClass = "custom-section-class";
    const { container } = render(
      <ExhibitorBenefitsSection className={customClass} />,
    );

    const section = container.querySelector("section");
    expect(section).toHaveClass(customClass);
    expect(section).toHaveClass("py-16");
    expect(section).toHaveClass("bg-surface");
  });

  it("rendert alle Benefit-Elemente mit ihren Titeln und Beschreibungen korrekt.", () => {
    render(<ExhibitorBenefitsSection />);

    const benefitsList = screen.getByRole("list", {
      name: "Vorteile für Aussteller",
    });
    expect(benefitsList).toBeInTheDocument();

    const benefitItems = within(benefitsList).getAllByRole("listitem");
    expect(benefitItems).toHaveLength(4);

    // Die einzelnen Items im Detail prüfen (mit neuen Textänderungen)
    const expectedBenefits = [
      {
        title: "Sichtbarkeit steigern",
        desc: "Machen Sie Ihre Firma am Campus bekannt und sorgen Sie dafür, dass Studierende Sie bei der Suche sofort als Option im Kopf haben.",
      },
      {
        title: "Talente treffen",
        desc: "Nutzen Sie die Gelegenheit, qualifizierte Studierende und Absolventen aller Fachrichtungen persönlich kennenzulernen.",
      },
      {
        title: "Effizientes Recruiting",
        desc: "Treffen Sie Ihre zukünftigen Mitarbeiter einfach persönlich und klären Sie alles Wichtige direkt im ersten Gespräch.",
      },
      {
        title: "Netzwerk erweitern",
        desc: "Werden Sie Teil der regionalen Community, tauschen Sie sich mit anderen Firmen aus und bleiben Sie im engen Kontakt mit der Hochschule Hof.",
      },
    ];

    expectedBenefits.forEach((benefit, index) => {
      const item = benefitItems[index];
      expect(item).toHaveAttribute("tabindex", "0");

      const titleHeading = within(item).getByRole("heading", {
        level: 4,
        name: benefit.title,
      });
      expect(titleHeading).toBeInTheDocument();

      const description = within(item).getByText(benefit.desc);
      expect(description).toBeInTheDocument();
    });
  });

  it("rendert den Leistungen-Bereich und alle Leistungspunkte korrekt.", () => {
    render(<ExhibitorBenefitsSection />);

    const servicesHeading = screen.getByRole("heading", {
      level: 3,
      name: "Leistungen für Aussteller",
    });
    expect(servicesHeading).toBeInTheDocument();
    expect(servicesHeading).toHaveAttribute("tabindex", "0");

    const col1 = screen.getByRole("list", { name: "Leistungen Spalte 1" });
    const col2 = screen.getByRole("list", { name: "Leistungen Spalte 2" });
    expect(col1).toBeInTheDocument();
    expect(col2).toBeInTheDocument();

    const expectedServices = [
      "Messestand",
      "Unternehmensprofil",
      "Verpflegung",
      "Support vor Ort",
    ];

    expectedServices.forEach((service) => {
      const serviceElement = screen.getByText(service);
      expect(serviceElement).toBeInTheDocument();
      const listItem = serviceElement.closest("li");
      expect(listItem).toBeInTheDocument();
      expect(listItem).toHaveAttribute("tabindex", "0");
    });
  });

  it("hat keine Barrierefreiheitsverletzungen (A11y-Violations).", async () => {
    const { container } = render(<ExhibitorBenefitsSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("erlaubt die Tastatur-Fokussierung aller Überschriften und Listenelemente über Tab-Navigation.", async () => {
    const user = userEvent.setup();
    render(<ExhibitorBenefitsSection />);

    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: "Infos für Aussteller",
    });
    const subHeading1 = screen.getByRole("heading", {
      level: 3,
      name: "Ihre Messeauftritt.",
    });
    const subHeading2 = screen.getByRole("heading", {
      level: 3,
      name: "Leistungen für Aussteller",
    });

    const benefitsList = screen.getByRole("list", {
      name: "Vorteile für Aussteller",
    });
    const benefitItems = within(benefitsList).getAllByRole("listitem");

    const col1 = screen.getByRole("list", { name: "Leistungen Spalte 1" });
    const col2 = screen.getByRole("list", { name: "Leistungen Spalte 2" });
    const serviceItems = [
      ...within(col1).getAllByRole("listitem"),
      ...within(col2).getAllByRole("listitem"),
    ];

    // Ersten Tab auslösen -> fokussiert die H2 Hauptüberschrift
    await user.tab();
    expect(mainHeading).toHaveFocus();

    // Zweiten Tab -> fokussiert H3 Unterüberschrift "Ihre Messeauftritt."
    await user.tab();
    expect(subHeading1).toHaveFocus();

    // Durch die 4 Benefit-Listenelemente durchtabben
    for (const item of benefitItems) {
      await user.tab();
      expect(item).toHaveFocus();
    }

    // Nächster Tab -> fokussiert H3 "Leistungen für Aussteller"
    await user.tab();
    expect(subHeading2).toHaveFocus();

    // Durch die 4 Service-Listenelemente durchtabben
    for (const item of serviceItems) {
      await user.tab();
      expect(item).toHaveFocus();
    }
  });

  it("reagiert auf Enter- und Space-Tastendrücke sowie Escape auf den fokussierbaren Elementen ohne Fehler zu werfen.", async () => {
    const user = userEvent.setup();
    render(<ExhibitorBenefitsSection />);

    const mainHeading = screen.getByRole("heading", { level: 2 });
    mainHeading.focus();
    expect(mainHeading).toHaveFocus();

    // Tastendrücke simulieren
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    await user.keyboard("{Escape}");

    const listItems = screen.getAllByRole("listitem");
    for (const item of listItems) {
      item.focus();
      expect(item).toHaveFocus();

      await user.keyboard("{Enter}");
      await user.keyboard(" ");
      await user.keyboard("{Escape}");
    }
  });
});
