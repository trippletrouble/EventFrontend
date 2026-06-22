import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogoUpload } from './LogoUpload';
import { getLogoUploadUrl, updateCompany } from '@/services/company.service';

expect.extend(toHaveNoViolations);

jest.mock('@/services/company.service', () => ({
  getLogoUploadUrl: jest.fn(),
  updateCompany: jest.fn(),
}));

describe('LogoUpload & ImageDropzone', () => {
  const mockOnUploadSuccess = jest.fn();
  const defaultProps = {
    companyId: 42,
    companyName: 'Test Firma',
    currentLogoUrl: undefined,
    onUploadSuccess: mockOnUploadSuccess,
    isEditing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock URL.createObjectURL and URL.revokeObjectURL
    window.URL.createObjectURL = jest.fn().mockReturnValue('blob:http://localhost/mock-blob-uuid');
    window.URL.revokeObjectURL = jest.fn();
  });

  it('has no accessibility violations in view mode', async () => {
    const { container } = render(<LogoUpload {...defaultProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders placeholder icon and "Logo fehlt" when no logo is set', () => {
    render(<LogoUpload {...defaultProps} />);
    expect(screen.getByText('Logo fehlt')).toBeInTheDocument();
  });

  it('renders the company logo image when currentLogoUrl is provided', () => {
    render(<LogoUpload {...defaultProps} currentLogoUrl="/logos/test.png" />);
    const img = screen.getByAltText('Test Firma Logo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/logos/test.png');
  });

  it('does not show the "Ändern" overlay button when isEditing is false', () => {
    render(<LogoUpload {...defaultProps} />);
    expect(screen.queryByRole('button', { name: /firmenlogo ändern/i })).not.toBeInTheDocument();
  });

  it('shows the "Ändern" overlay button when isEditing is true', () => {
    render(<LogoUpload {...defaultProps} isEditing={true} />);
    const changeBtn = screen.getByRole('button', { name: /firmenlogo ändern/i });
    expect(changeBtn).toBeInTheDocument();
  });

  it('switches to select mode (ImageDropzone) when clicking "Ändern"', async () => {
    const user = userEvent.setup();
    render(<LogoUpload {...defaultProps} isEditing={true} />);
    
    const changeBtn = screen.getByRole('button', { name: /firmenlogo ändern/i });
    await user.click(changeBtn);

    expect(screen.getByLabelText(/bild per drag and drop ablegen oder klicken zum auswählen/i)).toBeInTheDocument();
  });

  it('supports cancelling selection back to view mode', async () => {
    const user = userEvent.setup();
    render(<LogoUpload {...defaultProps} isEditing={true} />);
    
    await user.click(screen.getByRole('button', { name: /firmenlogo ändern/i }));
    
    const cancelBtn = screen.getByRole('button', { name: /abbrechen/i });
    await user.click(cancelBtn);

    expect(screen.getByText('Logo fehlt')).toBeInTheDocument();
  });

  it('allows file selection, displays preview and can upload', async () => {
    const user = userEvent.setup();
    (getLogoUploadUrl as jest.Mock).mockResolvedValue({
      uploadUrl: 'http://localhost/minio-upload',
      logoUrl: 'http://localhost/logos/new-logo.png',
    });
    (updateCompany as jest.Mock).mockResolvedValue({});

    // Mock XMLHttpRequest
    const mockXhr = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      status: 200,
      upload: {
        addEventListener: jest.fn(),
      },
      onload: null as any,
    };
    const originalXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = jest.fn().mockImplementation(() => mockXhr) as any;

    render(<LogoUpload {...defaultProps} isEditing={true} />);
    
    // Switch to select mode
    await user.click(screen.getByRole('button', { name: /firmenlogo ändern/i }));

    // Simulate selecting a file
    const file = new File(['mock-image-data'], 'logo.png', { type: 'image/png' });
    const dropzone = screen.getByLabelText(/bild per drag and drop ablegen oder klicken/i);
    
    // Drag and drop event simulation
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
      },
    });

    // Verify preview mode shows up
    expect(await screen.findByText('logo.png')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logo hochladen/i })).toBeInTheDocument();

    // Trigger upload
    await user.click(screen.getByRole('button', { name: /logo hochladen/i }));

    expect(getLogoUploadUrl).toHaveBeenCalledWith(42, 'logo.png', 'image/png');
    expect(mockXhr.open).toHaveBeenCalledWith('PUT', 'http://localhost/minio-upload', true);

    // Simulate successful XHR load
    if (mockXhr.onload) {
      await act(async () => {
        await mockXhr.onload();
      });
    }

    await waitFor(() => {
      expect(updateCompany).toHaveBeenCalledWith(42, { logoUrl: 'http://localhost/logos/new-logo.png' });
      expect(mockOnUploadSuccess).toHaveBeenCalledWith('http://localhost/logos/new-logo.png');
    });

    window.XMLHttpRequest = originalXMLHttpRequest;
  });

  it('rejects files larger than 2MB', async () => {
    const user = userEvent.setup();
    render(<LogoUpload {...defaultProps} isEditing={true} />);
    
    await user.click(screen.getByRole('button', { name: /firmenlogo ändern/i }));

    // 3MB file
    const largeFile = new File([new ArrayBuffer(3 * 1024 * 1024)], 'large-logo.png', { type: 'image/png' });
    const dropzone = screen.getByLabelText(/bild per drag and drop ablegen oder klicken/i);
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [largeFile],
      },
    });

    expect(await screen.findByText('Die Datei ist zu groß. Maximale Größe ist 2MB.')).toBeInTheDocument();
  });

  it('rejects invalid file formats', async () => {
    const user = userEvent.setup();
    render(<LogoUpload {...defaultProps} isEditing={true} />);
    
    await user.click(screen.getByRole('button', { name: /firmenlogo ändern/i }));

    const docFile = new File(['text'], 'document.pdf', { type: 'application/pdf' });
    const dropzone = screen.getByLabelText(/bild per drag and drop ablegen oder klicken/i);
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [docFile],
      },
    });

    expect(await screen.findByText('Ungültiges Format. Erlaubt sind PNG, JPEG, GIF oder SVG.')).toBeInTheDocument();
  });
});
