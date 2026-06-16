import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CompanyForm } from './CompanyForm';
import type { CompanyDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

const mockCompany: CompanyDto = {
  companyId: 1,
  name: 'Hochschule Hof',
  email: 'info@hof-university.de',
  address: 'Alfons-Goppel-Platz 1',
  zip: '95028',
  city: 'Hof',
  status: 'VERIFIED',
  isSponsor: false,
};

describe('CompanyForm', () => {
  const defaultProps = {
    company: mockCompany,
    onSubmit: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // A11y Test
  it('has no accessibility violations', async () => {
    const { container } = render(<CompanyForm {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Render & Initial Values Test
  it('renders correctly with prepopulated initial values', () => {
    render(<CompanyForm {...defaultProps} />);

    expect(screen.getByLabelText(/Firmenname/i)).toHaveValue(mockCompany.name);
    expect(screen.getByLabelText(/E-Mail-Adresse/i)).toHaveValue(mockCompany.email);
    expect(screen.getByLabelText(/Straße und Hausnummer/i)).toHaveValue(mockCompany.address);
    expect(screen.getByLabelText(/Postleitzahl/i)).toHaveValue(mockCompany.zip);
    expect(screen.getByLabelText(/Ort/i)).toHaveValue(mockCompany.city);
    expect(screen.getByRole('button', { name: /Änderungen speichern/i })).toBeInTheDocument();
  });

  // Validation: Required fields
  it('shows validation error when required fields are cleared', async () => {
    const user = userEvent.setup();
    render(<CompanyForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/Firmenname/i);
    await user.clear(nameInput);

    const submitBtn = screen.getByRole('button', { name: /Änderungen speichern/i });
    await user.click(submitBtn);

    // Formularfehler Alert summary should render
    expect(screen.getByText('Bitte korrigieren Sie die markierten Felder vor dem Speichern.')).toBeInTheDocument();
    // Specific error message under the field
    expect(screen.getByText('Firmenname ist erforderlich.')).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  // Validation: Zip exactly 5 digits
  it('shows error if zip is not exactly 5 digits', async () => {
    const user = userEvent.setup();
    render(<CompanyForm {...defaultProps} />);

    const zipInput = screen.getByLabelText(/Postleitzahl/i);

    // Too short (4 digits)
    await user.clear(zipInput);
    await user.type(zipInput, '1234');
    await user.click(screen.getByRole('button', { name: /Änderungen speichern/i }));
    expect(screen.getByText('Die Postleitzahl muss genau 5 Ziffern enthalten.')).toBeInTheDocument();

    // Contains letters
    await user.clear(zipInput);
    await user.type(zipInput, '1234a');
    await user.click(screen.getByRole('button', { name: /Änderungen speichern/i }));
    expect(screen.getByText('Die Postleitzahl muss genau 5 Ziffern enthalten.')).toBeInTheDocument();
  });

  // Validation: Email format
  it('shows error if email format is invalid', async () => {
    const user = userEvent.setup();
    render(<CompanyForm {...defaultProps} />);

    const emailInput = screen.getByLabelText(/E-Mail-Adresse/i);

    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByRole('button', { name: /Änderungen speichern/i }));

    expect(screen.getByText('Bitte geben Sie eine gültige E-Mail-Adresse ein.')).toBeInTheDocument();
  });

  // Successful submission
  it('submits successfully and calls onSubmit when all fields are valid', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn().mockResolvedValue(undefined);
    render(<CompanyForm {...defaultProps} onSubmit={mockSubmit} />);

    const nameInput = screen.getByLabelText(/Firmenname/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name GmbH');

    await user.click(screen.getByRole('button', { name: /Änderungen speichern/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'Updated Name GmbH',
        email: mockCompany.email,
        address: mockCompany.address,
        zip: mockCompany.zip,
        city: mockCompany.city,
      });
    });

    // Renders success alert
    expect(screen.getByText('Die Änderungen an Ihrem Unternehmensprofil wurden erfolgreich gespeichert.')).toBeInTheDocument();
  });

  // Server error handling
  it('displays API submit error if PATCH request fails', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn().mockRejectedValue(new Error('API-Server nicht erreichbar.'));
    render(<CompanyForm {...defaultProps} onSubmit={mockSubmit} />);

    await user.click(screen.getByRole('button', { name: /Änderungen speichern/i }));

    await waitFor(() => {
      expect(screen.getByText('API-Server nicht erreichbar.')).toBeInTheDocument();
    });
  });

  // Loading state
  it('renders loading indicators and disables controls in loading mode', () => {
    render(<CompanyForm {...defaultProps} isLoading={true} />);

    const submitBtn = screen.getByRole('button', { name: /Speichert.../i });
    expect(submitBtn).toHaveAttribute('aria-disabled', 'true');
  });


  // Clear errors on typing
  it('clears error messages when the user corrects input text', async () => {
    const user = userEvent.setup();
    render(<CompanyForm {...defaultProps} />);

    const nameInput = screen.getByLabelText(/Firmenname/i);
    await user.clear(nameInput);
    await user.click(screen.getByRole('button', { name: /Änderungen speichern/i }));

    expect(screen.getByText('Firmenname ist erforderlich.')).toBeInTheDocument();

    // Type to clear error
    await user.type(nameInput, 'New Company');
    expect(screen.queryByText('Firmenname ist erforderlich.')).not.toBeInTheDocument();
  });
});
