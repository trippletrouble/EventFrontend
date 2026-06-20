import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import ExhibitorSkeletonDefault, { ExhibitorSkeleton } from './ExhibitorSkeleton';

expect.extend(toHaveNoViolations);

describe('ExhibitorSkeleton', () => {
  it('hat keine Barrierefreiheitsverletzungen (A11y-Violations)', async () => {
    const { container } = render(<ExhibitorSkeleton count={3} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert standardmäßig sechs Ladeplatzhalter, wenn keine Anzahl übergeben wird', () => {
    render(<ExhibitorSkeleton />);
    const skeletons = screen.getAllByTestId('exhibitor-skeleton');
    expect(skeletons.length).toBe(6);
  });

  it('rendert die exakte Anzahl an Platzhaltern, wenn count definiert ist', () => {
    render(<ExhibitorSkeleton count={3} />);
    const skeletons = screen.getAllByTestId('exhibitor-skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('exportiert die Komponente als Standard-Export', () => {
    expect(ExhibitorSkeletonDefault).toBe(ExhibitorSkeleton);
  });
});
