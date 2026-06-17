import React from "react";
import Link from "next/link";
import { HofLogo } from "./HofLogo";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
  external = false,
}) => {
  const commonCls =
    "inline-flex items-center gap-1 text-sm text-[--color-foreground-muted] hover:text-[--color-brand-yellow] transition-colors duration-200 focus-ring rounded";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={commonCls}
      >
        {children}
        <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link href={href} className={commonCls}>
      {children}
    </Link>
  );
};

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h3 className="text-xs font-semibold uppercase tracking-widest text-[--color-brand-yellow] mb-4">
    {children}
  </h3>
);

// ─── Main Footer ──────────────────────────────────────────────────────────────

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-[--color-surface-raised] border-t border-[--color-surface-overlay] text-[--color-foreground-muted]"
      aria-label="Seitenfußzeile"
    >
      {/* Top grid */}
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* ── Column 1: Brand ── */}
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          {/* Logo inherits currentColor from parent */}
          <div className="text-white">
            <HofLogo className="h-9 w-auto" showText href="/" />
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Die Karrieremesse der Hochschule Hof. Studierende treffen auf
            regionale und überregionale Unternehmen.
          </p>
          <p className="text-sm font-medium text-[--color-foreground]">
            Unternehmerbörse 2026
          </p>
        </div>

        {/* ── Column 2: Impressum ── */}
        <div>
          <SectionHeading>Impressum</SectionHeading>
          <address className="not-italic flex flex-col gap-2 text-sm leading-relaxed">
            <span className="font-semibold text-[--color-foreground]">
              Hochschule für angewandte Wissenschaften Hof
            </span>
            <span>Alfons-Goppel-Platz 1</span>
            <span>95028 Hof an der Saale</span>
            <span className="mt-1">
              Vertreten durch: Präsident Prof. Dr. Dr. h.c. Jürgen Lehmann
            </span>
            <span>USt-IdNr.: DE 237 491 367</span>
            <span>
              Zuständige Aufsichtsbehörde: Bayerisches Staatsministerium für
              Wissenschaft und Kunst
            </span>
          </address>
          <div className="mt-4">
            <FooterLink href="/imprint">Vollständiges Impressum →</FooterLink>
          </div>
        </div>

        {/* ── Column 3: Kontakt ── */}
        <div>
          <SectionHeading>Kontakt</SectionHeading>
          <ul className="flex flex-col gap-3 text-sm" role="list">
            <li>
              <a
                href="mailto:unternehmerboerse@hof-university.de"
                className="inline-flex items-center gap-2 text-[--color-foreground-muted] hover:text-[--color-brand-yellow] transition-colors duration-200 focus-ring rounded"
              >
                <Mail
                  className="h-4 w-4 shrink-0 text-[--color-brand-yellow]"
                  aria-hidden="true"
                />
                <span>unternehmerboerse@hof-university.de</span>
              </a>
            </li>
            <li>
              <a
                href="tel:+4992813060"
                className="inline-flex items-center gap-2 text-[--color-foreground-muted] hover:text-[--color-brand-yellow] transition-colors duration-200 focus-ring rounded"
              >
                <Phone
                  className="h-4 w-4 shrink-0 text-[--color-brand-yellow]"
                  aria-hidden="true"
                />
                <span>+49 9281 306-0</span>
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin
                className="h-4 w-4 shrink-0 mt-0.5 text-[--color-brand-yellow]"
                aria-hidden="true"
              />
              <span>
                Alfons-Goppel-Platz 1<br />
                95028 Hof an der Saale
              </span>
            </li>
          </ul>
          <div className="mt-4">
            <FooterLink href="/contact">Kontaktformular →</FooterLink>
          </div>
        </div>

        {/* ── Column 4: Links ── */}
        <div>
          <SectionHeading>Schnelllinks</SectionHeading>
          <nav aria-label="Footer-Navigation">
            <ul className="flex flex-col gap-2 text-sm" role="list">
              <li>
                <FooterLink href="/#event-info">Das Event</FooterLink>
              </li>
              <li>
                <FooterLink href="/#exhibitor-info">Für Aussteller</FooterLink>
              </li>
              <li>
                <FooterLink href="/#student-info">Für Studierende</FooterLink>
              </li>
              <li>
                <FooterLink href="/ticketshop">Tickets kaufen</FooterLink>
              </li>
              <li>
                <FooterLink href="https://www.hof-university.de" external>
                  Hochschule Hof
                </FooterLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom legal bar */}
      <div className="border-t border-[--color-surface-overlay]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>
            © {currentYear} Hochschule für angewandte Wissenschaften Hof. Alle
            Rechte vorbehalten.
          </p>
          <nav aria-label="Rechtliche Links">
            <ul className="flex items-center gap-4 flex-wrap" role="list">
              <li>
                <Link
                  href="/imprint"
                  className="hover:text-[--color-brand-yellow] transition-colors duration-200 focus-ring rounded"
                >
                  Impressum
                </Link>
              </li>
              <li aria-hidden="true" className="text-[--color-surface-overlay]">
                ·
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[--color-brand-yellow] transition-colors duration-200 focus-ring rounded"
                >
                  Datenschutz
                </Link>
              </li>
              <li aria-hidden="true" className="text-[--color-surface-overlay]">
                ·
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="hover:text-[--color-brand-yellow] transition-colors duration-200 focus-ring rounded"
                >
                  Barrierefreiheit
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
