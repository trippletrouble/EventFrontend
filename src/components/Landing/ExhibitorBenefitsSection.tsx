import React from "react";
import { Megaphone, Users, FileClock, Network } from "lucide-react";
import { cn } from "@/utils/cn";

const BENEFIT_ITEMS = [
  {
    id: "sichtbarkeit",
    title: "Sichtbarkeit steigern",
    description:
      "Machen Sie Ihre Firma am Campus bekannt und sorgen Sie dafür, dass Studierende Sie bei der Suche sofort als Option im Kopf haben.",
    icon: Megaphone,
    iconColorClass: "text-brand-yellow",
  },
  {
    id: "talente",
    title: "Talente treffen",
    description:
      "Nutzen Sie die Gelegenheit, qualifizierte Studierende und Absolventen aller Fachrichtungen persönlich kennenzulernen.",
    icon: Users,
    iconColorClass: "text-brand-blue",
  },
  {
    id: "recruiting",
    title: "Effizientes Recruiting",
    description:
      "Treffen Sie Ihre zukünftigen Mitarbeiter einfach persönlich und klären Sie alles Wichtige direkt im ersten Gespräch.",
    icon: FileClock,
    iconColorClass: "text-brand-red",
  },
  {
    id: "netzwerk",
    title: "Netzwerk erweitern",
    description:
      "Werden Sie Teil der regionalen Community, tauschen Sie sich mit anderen Firmen aus und bleiben Sie im engen Kontakt mit der Hochschule Hof.",
    icon: Network,
    iconColorClass: "text-brand-green",
  },
];

const SERVICE_LIST_ITEMS = [
  { id: "messestand", label: "Messestand" },
  { id: "profil", label: "Unternehmensprofil" },
  { id: "verpflegung", label: "Verpflegung" },
  { id: "support", label: "Support vor Ort" },
];

export interface ExhibitorBenefitsSectionProps {
  mainTitle?: string;
  title?: string;
  className?: string;
}

export default function ExhibitorBenefitsSection({
  mainTitle = "Infos für Aussteller",
  title = "Ihre Messeauftritt.",
  className,
}: ExhibitorBenefitsSectionProps) {
  return (
    <section
      id="exhibitor-benefits"
      aria-labelledby="exhibitor-benefits-heading"
      className={cn("py-16 bg-surface text-foreground relative", className)}
      data-navbar="dark"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hauptüberschrift */}
        <h2
          id="exhibitor-benefits-heading"
          tabIndex={0}
          className="text-3xl md:text-[40px] font-extrabold text-center text-foreground mb-12 focus-ring rounded block px-2"
        >
          {mainTitle}
        </h2>

        <div className="max-w-3xl mx-auto">
          {/* Unterüberschrift */}
          <h3
            tabIndex={0}
            className="text-xl md:text-2xl font-bold text-left text-foreground mb-4 focus-ring rounded inline-block px-1"
          >
            {title}
          </h3>

          {/* Grüne Trennlinie */}
          <hr
            className="mb-8 border-t border-brand-green"
            style={{ borderWidth: "1.5px" }}
            aria-hidden="true"
          />

          {/* Liste der Vorteile */}
          <div
            className="space-y-8"
            role="list"
            aria-label="Vorteile für Aussteller"
          >
            {BENEFIT_ITEMS.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  role="listitem"
                  tabIndex={0}
                  className="flex gap-6 items-start rounded-lg p-3 w-full transition-all focus-ring hover:bg-surface-raised/20"
                >
                  <div
                    className={cn(
                      "flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-[6px] bg-transparent",
                      item.iconColorClass,
                    )}
                    aria-hidden="true"
                  >
                    <IconComponent className="w-8 h-8" strokeWidth={1.5} />
                  </div>

                  <div className="flex-grow">
                    <h4 className="font-extrabold text-lg md:text-xl text-foreground mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm md:text-base leading-relaxed text-foreground-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grüne Trennlinie */}
          <hr
            className="mt-8 mb-8 border-t border-brand-green"
            style={{ borderWidth: "1.5px" }}
            aria-hidden="true"
          />

          {/* Leistungen für Aussteller Bereich */}
          <div className="text-left">
            <h3
              tabIndex={0}
              className="text-xl md:text-2xl font-bold text-foreground mb-6 focus-ring rounded inline-block px-1"
            >
              Leistungen für Aussteller
            </h3>

            {/* Zwei-Spalten-Liste für Leistungen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-12 pl-6 mt-4">
              <ul
                className="space-y-3 text-left list-none"
                role="list"
                aria-label="Leistungen Spalte 1"
              >
                <li
                  className="flex items-center gap-3 text-foreground text-sm md:text-base focus-ring rounded p-1"
                  tabIndex={0}
                  role="listitem"
                >
                  <span
                    className="text-foreground select-none"
                    aria-hidden="true"
                  >
                    •
                  </span>
                  <span>{SERVICE_LIST_ITEMS[0].label}</span>
                </li>
                <li
                  className="flex items-center gap-3 text-foreground text-sm md:text-base focus-ring rounded p-1"
                  tabIndex={0}
                  role="listitem"
                >
                  <span
                    className="text-foreground select-none"
                    aria-hidden="true"
                  >
                    •
                  </span>
                  <span>{SERVICE_LIST_ITEMS[1].label}</span>
                </li>
              </ul>
              <ul
                className="space-y-3 text-left list-none"
                role="list"
                aria-label="Leistungen Spalte 2"
              >
                <li
                  className="flex items-center gap-3 text-foreground text-sm md:text-base focus-ring rounded p-1"
                  tabIndex={0}
                  role="listitem"
                >
                  <span
                    className="text-foreground select-none"
                    aria-hidden="true"
                  >
                    •
                  </span>
                  <span>{SERVICE_LIST_ITEMS[2].label}</span>
                </li>
                <li
                  className="flex items-center gap-3 text-foreground text-sm md:text-base focus-ring rounded p-1"
                  tabIndex={0}
                  role="listitem"
                >
                  <span
                    className="text-foreground select-none"
                    aria-hidden="true"
                  >
                    •
                  </span>
                  <span>{SERVICE_LIST_ITEMS[3].label}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
