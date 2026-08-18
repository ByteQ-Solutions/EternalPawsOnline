/**
 * Eternal Paws Platform - Admin Authentication Service
 * Path: src/lib/auth/auth-service.ts
 */

import { AdminUser, UserRole, ROLE_PERMISSIONS_MAP, RolePermissions } from './types';

// Default staff accounts for administrator access
const DEFAULT_STAFF: (AdminUser & { passwordHash: string })[] = [
  {
    id: 'user-000',
    email: 'pawsluvshop@gmail.com',
    name: 'Eternal Paws Administrator',
    role: 'super_admin',
    passwordHash: 'admin123',
  },
  {
    id: 'user-001',
    email: 'editor@eternal-paws.org',
    name: 'Sarah Jenkins',
    role: 'super_admin',
    passwordHash: 'admin123',
  },
  {
    id: 'user-002',
    email: 'factcheck@eternal-paws.org',
    name: 'Elena Rostova',
    role: 'fact_checker',
    passwordHash: 'verify123',
  },
];

export class AuthService {
  static authenticate(email: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const userRecord = DEFAULT_STAFF.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!userRecord || userRecord.passwordHash !== password) {
      return { success: false, error: 'Invalid email address or password.' };
    }

    const { passwordHash: _, ...safeUser } = userRecord;
    return { success: true, user: safeUser };
  }

  static getPermissions(role: UserRole): RolePermissions {
    return ROLE_PERMISSIONS_MAP[role] || ROLE_PERMISSIONS_MAP.writer;
  }

  static hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
    const permissions = this.getPermissions(role);
    return Boolean(permissions[permission]);
  }
}
