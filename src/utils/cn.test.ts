import { cn } from './cn';

describe('cn', () => {
  it('merged Tailwind-Klassen korrekt', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6');
  });

  it('entfernt falsy Werte', () => {
    expect(cn('text-sm', false && 'text-lg', undefined, null)).toBe('text-sm');
  });

  it('merged bedingte Klassen', () => {
    const isError = true;
    expect(cn('border', isError && 'border-destructive')).toContain('border-destructive');
  });

  it('gibt leeren String bei keinen Argumenten', () => {
    expect(cn()).toBe('');
  });
});
