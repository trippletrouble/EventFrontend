'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Menu, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MobileMenuProps {
  navLinks: { href: string; label: string }[];
  isAuthenticated: boolean;
  logout: () => void;
  onDarkBg: boolean;
  dropdownCls: string;
  dropdownItemCls: string;
}

export function MobileMenu({
  navLinks,
  isAuthenticated,
  logout,
  onDarkBg,
  dropdownCls,
  dropdownItemCls,
}: MobileMenuProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <DropdownMenu.Root open={mobileOpen} onOpenChange={setMobileOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'md:hidden p-2 rounded-lg transition-colors',
            onDarkBg ? 'hover:bg-white/10' : 'hover:bg-black/5'
          )}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(dropdownCls, 'min-w-[220px] mr-4 mt-2')}
          align="end"
          sideOffset={8}
        >
          {navLinks.map((link) => (
            <DropdownMenu.Item key={link.href} asChild>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={cn(dropdownItemCls, 'text-white/90')}
              >
                {link.label}
              </Link>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="my-1 border-t border-white/10" />
          {isAuthenticated ? (
            <DropdownMenu.Item
              onSelect={() => {
                setMobileOpen(false);
                logout();
              }}
              className={cn(dropdownItemCls, 'hover:bg-red-500/10 text-red-400')}
            >
              Abmelden
            </DropdownMenu.Item>
          ) : (
            <DropdownMenu.Item asChild>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={cn(dropdownItemCls, 'font-semibold text-[#EAB308]')}
              >
                Anmelden
              </Link>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default MobileMenu;
