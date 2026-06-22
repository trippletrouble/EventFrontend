import { registerCompany, getCompany, updateCompany, getMyCompany, getLogoUploadUrl } from './company.service';
import { apiFetch } from './api';

jest.mock('./api');

describe('company.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registerCompany makes a POST request and returns company details', async () => {
    const requestData = {
      name: 'New Company',
      address: 'Strasse 2',
      zip: '54321',
      city: 'Stadt 2',
      email: 'new@company.de',
    };
    const mockResponse = { companyId: 101, ...requestData };
    (apiFetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await registerCompany(requestData);

    expect(apiFetch).toHaveBeenCalledWith('/companies', {
      method: 'POST',
      body: requestData,
    });
    expect(result).toEqual(mockResponse);
  });

  it('getCompany makes a GET request and returns company details by ID', async () => {
    const mockResponse = { companyId: 42, name: 'Hochschule Hof' };
    (apiFetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getCompany(42);

    expect(apiFetch).toHaveBeenCalledWith('/companies/42');
    expect(result).toEqual(mockResponse);
  });

  it('updateCompany makes a PATCH request and returns updated company details', async () => {
    const patchData = {
      name: 'Updated Name',
    };
    const mockResponse = { companyId: 1, name: 'Updated Name', email: 'info@hof.de' };
    (apiFetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await updateCompany(1, patchData);

    expect(apiFetch).toHaveBeenCalledWith('/companies/1', {
      method: 'PATCH',
      body: patchData,
    });
    expect(result).toEqual(mockResponse);
  });

  it('getMyCompany makes a GET request to /auth/me and returns current company', async () => {
    const mockResponse = { companyId: 101, name: 'Test Corp' };
    (apiFetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getMyCompany();

    expect(apiFetch).toHaveBeenCalledWith('/auth/me');
    expect(result).toEqual(mockResponse);
  });

  it('getLogoUploadUrl makes a POST request and returns upload and destination URLs', async () => {
    const mockResponse = {
      uploadUrl: 'http://minio/upload',
      logoUrl: 'http://minio/logo.png',
    };
    (apiFetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getLogoUploadUrl(42, 'logo.png', 'image/png');

    expect(apiFetch).toHaveBeenCalledWith('/companies/42/logo-upload-url', {
      method: 'POST',
      body: { filename: 'logo.png', contentType: 'image/png' },
    });
    expect(result).toEqual(mockResponse);
  });
});
