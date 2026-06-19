import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExhibitorPagination } from './ExhibitorPagination';

expect.extend(toHaveNoViolations);

describe('ExhibitorPagination', () => {
  const onPageChangeMock = jest.fn();

  beforeEach(() => {
    onPageChangeMock.mockClear();
  });

  it('hat keine A11y-Violations', async () => {
    const { container } = render(
      <ExhibitorPagination currentPage={1} totalPages={3} onPageChange={onPageChangeMock} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert alle Seiten-Buttons korrekt', () => {
    render(<ExhibitorPagination currentPage={2} totalPages={3} onPageChange={onPageChangeMock} />);

    expect(screen.getByRole('button', { name: 'Gehe zu Seite 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gehe zu Seite 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gehe zu Seite 3' })).toBeInTheDocument();
    
    // Check aria-current on the active page
    const currentPageButton = screen.getByRole('button', { name: 'Gehe zu Seite 2' });
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('deaktiviert Vorherige-Button auf der ersten Seite', () => {
    render(<ExhibitorPagination currentPage={1} totalPages={3} onPageChange={onPageChangeMock} />);

    const prevButton = screen.getByRole('button', { name: 'Vorherige Seite' });
    expect(prevButton).toBeDisabled();

    const nextButton = screen.getByRole('button', { name: 'Nächste Seite' });
    expect(nextButton).not.toBeDisabled();
  });

  it('deaktiviert Nächste-Button auf der letzten Seite', () => {
    render(<ExhibitorPagination currentPage={3} totalPages={3} onPageChange={onPageChangeMock} />);

    const prevButton = screen.getByRole('button', { name: 'Vorherige Seite' });
    expect(prevButton).not.toBeDisabled();

    const nextButton = screen.getByRole('button', { name: 'Nächste Seite' });
    expect(nextButton).toBeDisabled();
  });

  it('ruft onPageChange auf bei Klick auf eine Seitenzahl', async () => {
    const user = userEvent.setup();
    render(<ExhibitorPagination currentPage={1} totalPages={3} onPageChange={onPageChangeMock} />);

    const page3Button = screen.getByRole('button', { name: 'Gehe zu Seite 3' });
    await user.click(page3Button);

    expect(onPageChangeMock).toHaveBeenCalledWith(3);
  });

  it('ruft onPageChange auf bei Klick auf Nächste Seite', async () => {
    const user = userEvent.setup();
    render(<ExhibitorPagination currentPage={1} totalPages={3} onPageChange={onPageChangeMock} />);

    const nextButton = screen.getByRole('button', { name: 'Nächste Seite' });
    await user.click(nextButton);

    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });

  it('ruft onPageChange auf bei Klick auf Vorherige Seite', async () => {
    const user = userEvent.setup();
    render(<ExhibitorPagination currentPage={2} totalPages={3} onPageChange={onPageChangeMock} />);

    const prevButton = screen.getByRole('button', { name: 'Vorherige Seite' });
    await user.click(prevButton);

    expect(onPageChangeMock).toHaveBeenCalledWith(1);
  });
});
