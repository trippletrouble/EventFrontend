import type { CompanyDto } from '@/types/api.types';

export const mockCompany: CompanyDto = {
  companyId: 1,
  name: 'Test GmbH',
  address: 'Teststraße 1',
  zip: '95028',
  city: 'Hof',
  email: 'info@test-gmbh.de',
  status: 'VERIFIED',
  isSponsor: false,
  _links: {
    self: { href: '/companies/1' },
  },
};

export const mockPendingCompany: CompanyDto = {
  ...mockCompany,
  companyId: 2,
  name: 'Pending AG',
  status: 'PENDING',
};

export const mockSponsorCompany: CompanyDto = {
  ...mockCompany,
  companyId: 3,
  name: 'Sponsor Corp',
  isSponsor: true,
};

export const mockCompanies: CompanyDto[] = [
  mockCompany,
  mockPendingCompany,
  mockSponsorCompany,
];
