import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlphabetFilterDefault, { AlphabetFilter } from './AlphabetFilter';

expect.extend(toHaveNoViolations);

describe('AlphabetFilter', () => {
  const onLetterChangeMock = jest.fn();

  beforeEach(() => {
    onLetterChangeMock.mockClear();
  });

  it('hat keine Barrierefreiheitsverletzungen (A11y-Violations)', async () => {
    const { container } = render(
      <AlphabetFilter selectedLetter="Alle" onLetterChange={onLetterChangeMock} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert alle Buchstaben und Sonderfilter-Schaltflächen korrekt', () => {
    render(<AlphabetFilter selectedLetter="Alle" onLetterChange={onLetterChangeMock} />);

    expect(screen.getByRole('button', { name: 'Alle Aussteller anzeigen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aussteller mit Anfangsbuchstabe A anzeigen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aussteller mit Anfangsbuchstabe Z anzeigen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aussteller beginnend mit Ziffern anzeigen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aussteller mit sonstigen Zeichen anzeigen' })).toBeInTheDocument();
  });

  it('hebt den aktuell ausgewählten Buchstaben optisch und semantisch hervor', () => {
    render(<AlphabetFilter selectedLetter="B" onLetterChange={onLetterChangeMock} />);

    const activeBtn = screen.getByRole('button', { name: 'Aussteller mit Anfangsbuchstabe B anzeigen' });
    expect(activeBtn).toHaveAttribute('aria-current', 'true');
    expect(activeBtn).toHaveClass('text-primary');

    const inactiveBtn = screen.getByRole('button', { name: 'Aussteller mit Anfangsbuchstabe A anzeigen' });
    expect(inactiveBtn).not.toHaveAttribute('aria-current');
    expect(inactiveBtn).toHaveClass('text-foreground-muted');
  });

  it('ruft onLetterChange auf, wenn ein Buchstabe angeklickt wird', async () => {
    const user = userEvent.setup();
    render(<AlphabetFilter selectedLetter="Alle" onLetterChange={onLetterChangeMock} />);

    const letterC = screen.getByRole('button', { name: 'Aussteller mit Anfangsbuchstabe C anzeigen' });
    await user.click(letterC);

    expect(onLetterChangeMock).toHaveBeenCalledWith('C');
  });

  it('exportiert die Komponente als Standard-Export', () => {
    expect(AlphabetFilterDefault).toBe(AlphabetFilter);
  });
});
