'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { HofLogo } from './HofLogo';
import { User } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/utils/cn';
import MobileMenu from './MobileMenu';

const LANDING_NAV = [
  { anchor: 'event-info', label: 'Das Event' },
  { anchor: 'exhibitor-benefits', label: 'Für Aussteller' },
  { anchor: 'student-info', label: 'Für Studierende' },
];

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [navTheme, setNavTheme] = useState<'dark' | 'light'>('dark');
  const [companyId, setCompanyId] = useState<number | null>(null);

  const isLandingPage = pathname === '/';
  const hasHero = pathname === '/' || pathname === '/ticketshop';

  useEffect(() => {
    if (isAuthenticated) {
      import('@/services/company.service')
        .then((m) => m.getMyCompany())
        .then((company) => {
          if (company?.companyId) {
            setCompanyId(company.companyId);
          }
        })
        .catch((err) => {
          console.error('Failed to load my company for header:', err);
        });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCompanyId(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 10);
      if (!hasHero) return;
      const sections = document.querySelectorAll('section[data-navbar]');
      for (const section of Array.from(sections)) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 80 && rect.bottom >= 0) {
          const t = section.getAttribute('data-navbar');
          if (t === 'light' || t === 'dark') setNavTheme(t);
        }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [hasHero]);

  const isTop = hasHero && !scrolled;

  // onDarkBg = true  → dark/transparent navbar → white text + white logo center
  // onDarkBg = false → white navbar            → dark text  + dark logo center
  const onDarkBg =
    isTop ||          // transparent hero
    !hasHero ||       // all other pages always dark navbar
    navTheme === 'light'; // light section behind → dark navbar

  // FIX 1: #0C1117 statt #111827 für dunkle Navbar
  const headerBg = isTop
    ? 'bg-transparent border-b border-transparent shadow-none'
    : hasHero && navTheme === 'dark'
      ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm'
      : 'bg-[#0C1117]/95 backdrop-blur-sm border-b border-white/10 shadow-sm';

  const navLinks = [
    ...LANDING_NAV.map((l) => ({
      href: isLandingPage ? `#${l.anchor}` : `/#${l.anchor}`,
      label: l.label,
    })),
    { href: '/aussteller', label: 'Aussteller' },
    { href: '/ticketshop', label: 'Stand buchen' },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    ...(companyId ? [{ href: `/company/${companyId}`, label: 'Firmenprofil' }] : []),
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  const linkCls = onDarkBg
    ? 'text-white/80 hover:text-white hover:bg-white/10'
    : 'text-[#0D1117]/70 hover:text-[#0D1117] hover:bg-black/5';

  const dropdownCls =
    'z-50 rounded-xl border p-2 shadow-2xl bg-[#0C1117] border-white/10 text-white';

  const dropdownItemCls =
    'flex w-full px-3 py-2.5 text-sm rounded-lg outline-none hover:bg-white/10 transition-colors cursor-pointer';

  return (
    // FIX 2: text color auf dem header selbst setzen →
    // HofLogo erbt currentColor → Mittel-Quadrat + Text wechseln automatisch
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out',
        headerBg,
        onDarkBg ? 'text-white' : 'text-[#0D1117]', // ← currentColor für HofLogo
      )}
    >
      <nav
        aria-label="Hauptnavigation"
        className="max-w-[1320px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between"
      >
        {/* Logo — erbt text-color via currentColor */}
        <HofLogo className="h-9 w-auto" showText href="/" />

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={cn('px-4 py-2 rounded-lg text-sm font-semibold transition-colors', linkCls)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {isAuthenticated ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  className={cn(
                    'hidden md:flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors',
                    onDarkBg ? 'hover:bg-white/10' : 'hover:bg-black/5',
                  )}
                  aria-label="Benutzermenü öffnen"
                >
                  <User className="h-5 w-5 text-[#EAB308]" aria-hidden="true" />
                  <span>{user?.firstName ?? 'Konto'}</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className={cn(dropdownCls, 'min-w-[180px]')} align="end" sideOffset={8}>
                  <DropdownMenu.Item asChild>
                    <Link href="/dashboard" className={dropdownItemCls}>Dashboard</Link>
                  </DropdownMenu.Item>
                  {companyId && (
                    <DropdownMenu.Item asChild>
                      <Link href={`/company/${companyId}`} className={dropdownItemCls}>Firmenprofil</Link>
                    </DropdownMenu.Item>
                  )}
                  {isAdmin && (
                    <DropdownMenu.Item asChild>
                      <Link href="/admin" className={dropdownItemCls}>Admin-Bereich</Link>
                    </DropdownMenu.Item>
                  )}
                  <DropdownMenu.Separator className="my-1 border-t border-white/10" />
                  <DropdownMenu.Item
                    onSelect={() => logout()}
                    className={cn(dropdownItemCls, 'hover:bg-red-500/10 text-red-400')}
                  >
                    Abmelden
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : (
            <Link
              href="/login"
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                linkCls
              )}
            >
              <span className="hidden md:inline">Anmelden</span>
              <span className="text-xs opacity-30" aria-hidden="true">|</span>
              <User className="w-5 h-5 text-[#EAB308]" aria-hidden="true" />
            </Link>
          )}

          {/* Mobile hamburger & menu */}
          <MobileMenu
            navLinks={navLinks}
            isAuthenticated={isAuthenticated}
            logout={logout}
            onDarkBg={onDarkBg}
            dropdownCls={dropdownCls}
            dropdownItemCls={dropdownItemCls}
          />
        </div>
      </nav>
    </header>
  );
}