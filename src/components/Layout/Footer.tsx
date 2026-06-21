import React from "react";
import Link from "next/link";

// ─── Main Footer ──────────────────────────────────────────────────────────────

const Footer: React.FC = () => {
  return (
      <footer
          className="bg-[#0b0c10] border-t border-[--color-surface-overlay] text-[--color-foreground-muted] py-16"
          aria-label="Seitenfußzeile"
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Column 1: Impressum & Datenschutz links */}
          <div className="flex flex-col gap-6 font-semibold text-white">
            <Link href="/imprint" className="hover:text-[--color-brand-yellow] transition-colors focus-ring rounded self-start">
              Impressum
            </Link>
            <Link href="/privacy" className="hover:text-[--color-brand-yellow] transition-colors focus-ring rounded self-start">
              Datenschutz
            </Link>
          </div>

          {/* Column 2: Kontakt (Address) */}
          <div className="flex flex-col text-sm text-[--color-foreground-muted]">
            <h3 className="font-semibold text-white mb-4">Kontakt</h3>
            <address className="not-italic flex flex-col gap-1">
              <span>Hochschule für angewandte Wissenschaften Hof</span>
              <span>Veranstaltungsmanagement</span>
              <span>Alfons-Goppel-Platz 1</span>
              <span>95028 Hof</span>
            </address>
          </div>

          {/* Column 3: Contact Details (E-Mail / Tel) */}
          {/* The top-padding aligns the email with the first line of the address on desktop */}
          <div className="flex flex-col text-sm text-[--color-foreground-muted] md:pt-9 pt-0">
            <div className="flex flex-col gap-1">
              <div>
                E-Mail:{" "}
                <a
                    href="mailto:info@events.hof-university.de"
                    className="underline hover:text-[--color-brand-yellow] transition-colors focus-ring rounded"
                >
                  info@events.hof-university.de
                </a>
              </div>
              <div>
                Tel.: 09281 / 409 - 3035 / 3009
              </div>
            </div>
          </div>

        </div>
      </footer>
  );
};

export default Footer;
