import type { UserDto } from '@/types/api.types';

export const mockUser: UserDto = {
  userId: 1,
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max@test.de',
  role: 'COMPANY_USER',
};

export const mockAdmin: UserDto = {
  userId: 2,
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@hof-university.de',
  role: 'ADMIN',
};

export const mockSession = {
  ...mockUser,
  _links: {
    self: { href: '/auth/session' },
    logout: { href: '/auth/logout', method: 'POST' },
  },
};
