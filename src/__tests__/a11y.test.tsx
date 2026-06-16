import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkipNavLink } from '@/components/Layout/SkipNavLink';
import fs from 'fs';
import path from 'path';

describe('Global Accessibility & Theme Requirements', () => {
  test('SkipNavLink is present and configured correctly', () => {
    render(<SkipNavLink />);
    const link = screen.getByRole('link', { name: /Zum Hauptinhalt springen/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
    expect(link).toHaveClass('sr-only');
    expect(link).toHaveClass('focus:not-sr-only');
  });

  test('globals.css implements prefers-reduced-motion rules', () => {
    const cssPath = path.resolve(__dirname, '../app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    expect(cssContent).toContain('prefers-reduced-motion: reduce');
    expect(cssContent).toContain('animation-duration: 0.01ms');
  });

  test('globals.css implements focus-visible outline visibility', () => {
    const cssPath = path.resolve(__dirname, '../app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    expect(cssContent).toContain('*:focus-visible');
    expect(cssContent).toContain('outline: 2px solid');
  });

  test('layout.tsx specifies German language attribute', () => {
    const layoutPath = path.resolve(__dirname, '../app/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    expect(layoutContent).toContain('lang="de"');
  });

  test('No component uses tabIndex > 0 (prevents keyboard traps / tab order issues)', () => {
    const componentsDir = path.resolve(__dirname, '../components');
    const appDir = path.resolve(__dirname, '../app');

    function checkDirForTabIndex(dir: string) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          checkDirForTabIndex(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          // Match pattern: tabIndex={X} or tabIndex="X" or tabIndex=X where X > 0
          const tabIndexMatch = content.match(/tabIndex=["']?([1-9]\d*)["']?/);
          const tabIndexBraceMatch = content.match(/tabIndex=\{\s*([1-9]\d*)\s*\}/);
          
          expect(tabIndexMatch).toBeNull();
          expect(tabIndexBraceMatch).toBeNull();
        }
      }
    }

    checkDirForTabIndex(componentsDir);
    checkDirForTabIndex(appDir);
  });

  test('No interactive tag has aria-hidden="true" or aria-hidden={true}', () => {
    const componentsDir = path.resolve(__dirname, '../components');
    const appDir = path.resolve(__dirname, '../app');

    function checkDirForAriaHidden(dir: string) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          checkDirForAriaHidden(fullPath);
        } else if (file.endsWith('.tsx')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          // Look for: <button ... aria-hidden="true" or <a ... aria-hidden="true" etc.
          // Note: we check typical interactive html elements
          const regex = /<(button|a|input|select|textarea)\b[^>]*aria-hidden=["']?true/i;
          const regexBrace = /<(button|a|input|select|textarea)\b[^>]*aria-hidden=\{\s*true\s*\}/i;
          
          expect(content.match(regex)).toBeNull();
          expect(content.match(regexBrace)).toBeNull();
        }
      }
    }

    checkDirForAriaHidden(componentsDir);
    checkDirForAriaHidden(appDir);
  });
});
