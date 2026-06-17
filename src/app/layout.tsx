import '@/env'
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import { Lexend, Lexend_Deca, Lexend_Exa, Lexend_Giga, Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/providers/SessionProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { SkipNavLink } from '@/components/Layout/SkipNavLink';

const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend', display: 'swap' });
const lexendDeca = Lexend_Deca({ subsets: ['latin'], variable: '--font-lexend-deca', display: 'swap' });
const lexendExa = Lexend_Exa({ subsets: ['latin'], variable: '--font-lexend-exa', display: 'swap' });
const lexendGiga = Lexend_Giga({ subsets: ['latin'], variable: '--font-lexend-giga', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Unternehmerbörse 2026 – Hochschule Hof',
  description: 'Die Karrieremesse der Hochschule Hof. Finden Sie Talente, präsentieren Sie Ihr Unternehmen.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html
          lang="de"
          className={`${lexend.variable} ${lexendDeca.variable} ${lexendExa.variable} ${lexendGiga.variable} ${inter.variable} h-full scroll-smooth scroll-pt-20`}
      >
          <body className="min-h-full flex flex-col font-sans bg-surface text-foreground antialiased">
              <AuthProvider>
                  <SkipNavLink />
                  <SessionProvider>
                      <ToastProvider>
                        {children}
                      </ToastProvider>
                  </SessionProvider>
              </AuthProvider>
          </body>
      </html>
  );
}