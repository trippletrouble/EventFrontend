export interface HateoasLink {
  href: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
}

export type Links = Record<string, HateoasLink>;

export interface ErrorResponseDto {
  statusCode: number;
  message: string;
  error: string;
  details?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  _links: Links;
}

export type UserRole = 'ADMIN' | 'COMPANY_USER';
export type CompanyStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type PackageType = 'BASE' | 'BASE_PLUS' | 'PREMIUM' | 'DELUXE';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';

