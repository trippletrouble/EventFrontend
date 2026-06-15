import type {
  Links, UserRole, CompanyStatus,
  EventStatus, BookingStatus, PaymentStatus, PaginatedResponse,
} from './common.types';

// User
export interface UserDto {
  userId: number;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  role: UserRole;
}

// Company
export interface CompanyDto {
  companyId: number;
  name: string;
  address: string;
  zip: string;
  city: string;
  email: string;
  status: CompanyStatus;
  isSponsor: boolean;
  members?: UserDto[];
  _links?: Links;
}

export interface RegisterCompanyRequestDto {
  name: string;
  address: string;
  zip: string;
  city: string;
  email: string;
  inviteCode?: string;
}

export interface UpdateCompanyRequestDto {
  name?: string;
  address?: string;
  zip?: string;
  city?: string;
  email?: string;
}

export interface AdminUpdateCompanyRequestDto {
  isSponsor?: boolean;
  status?: CompanyStatus;
}

// Event
export interface EventDto {
  eventId: number;
  name: string;
  eventDate: string;
  location: string;
  description: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
  _links?: Links;
}

export interface CreateEventRequestDto {
  name: string;
  eventDate: string;
  location: string;
  description: string;
}

export interface UpdateEventRequestDto {
  name?: string;
  eventDate?: string;
  location?: string;
  description?: string;
  status?: EventStatus;
}

export interface EventInfoDto {
  name: string;
  date: string;
  location: string;
}

// Tier (Package Type)
export interface TierDto {
  tierId: number;
  eventId: number;
  basePrice: number;           // Cents
  sponsorDiscountPercent: number;
  features: string[];
  slotsTotal: number;
  available: boolean;
  _links?: Links;
}

export interface AvailableTiersDto {
  data: TierDto[];
  _links?: Links;
}

export interface EventTierDto extends EventDto {
  tiers: TierDto[];
}

// Booking
export interface BookingDto {
  bookingId: number;
  companyId: number;
  eventId: number;
  tierId: number;
  bookedBy: number;
  status: BookingStatus;
  cancelledBy?: number | null;
  createdAt: string;
  updatedAt: string;
  _links?: Links;
}

export interface CreateBookingRequestDto {
  tierId: number;
  companyId: number;
}

export interface UpgradeBookingRequestDto {
  targetTierId: number;
}

export interface UpgradeBookingResponseDto {
  priceDifference: number; // Cents
  paymentUrl: string;
  _links?: Links;
}

export interface CancelBookingRequestDto {
  bookingId: number;
}

export interface CompanyBookingHistoryDto extends CompanyDto {
  bookings?: BookingDto;
}

// Payment
export interface CheckoutRequestDto {
  bookingId: number;
}

export interface CheckoutResponseDto {
  checkoutUrl: string;
}

export interface PaymentDto {
  paymentId: number;
  bookingId: number;
  stripeSessionId: string;
  amount: number;
  status: PaymentStatus;
  isUpgrade: boolean;
  createdAt: string;
  updatedAt: string;
}

// Invitation
export interface InvitationDto {
  invitationCode: string;
  _links?: Links;
}

// Admin
export interface PromoteAdminRequestDto {
  userId: number;
}

export interface DashboardKPIsDto {
  [key: string]: unknown;
}

// Paginated
export type PaginatedCompaniesDto = PaginatedResponse<CompanyDto>;
export type PaginatedEventsDto = PaginatedResponse<EventDto>;
export type PaginatedUsersDto = PaginatedResponse<UserDto>;

