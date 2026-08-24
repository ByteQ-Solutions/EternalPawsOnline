/**
 * Eternal Paws Platform - Admin Authentication Service
 * Path: src/lib/auth/auth-service.ts
 */

import { AdminUser, UserRole, ROLE_PERMISSIONS_MAP, RolePermissions } from './types';

export class AuthService {
  static authenticate(email: string, password: string): { success: boolean; user?: AdminUser; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || process.env.ADMIN_DEFAULT_EMAIL || 'admin@eternal-paws.org').trim().toLowerCase();
    const envAdminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_DEFAULT_PASSWORD || 'EternalAdmin2026!';

    // 1. Check dynamic Super Admin configured in Vercel Environment Variables
    if (trimmedEmail === envAdminEmail && password === envAdminPassword) {
      return {
        success: true,
        user: {
          id: 'super-admin-master',
          email: envAdminEmail,
          name: 'Eternal Paws Chief Editor',
          role: 'super_admin',
        },
      };
    }

    // 2. Editorial Staff Fallback (customizable via env)
    const staffAccounts: (AdminUser & { passwordHash: string })[] = [
      {
        id: 'staff-editor-01',
        email: 'editor@eternal-paws.org',
        name: 'Sarah Jenkins (Senior Editor)',
        role: 'super_admin',
        passwordHash: envAdminPassword,
      },
      {
        id: 'staff-factcheck-01',
        email: 'factcheck@eternal-paws.org',
        name: 'Elena Rostova (Fact Checker)',
        role: 'fact_checker',
        passwordHash: envAdminPassword,
      },
    ];

    const staffRecord = staffAccounts.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (staffRecord && staffRecord.passwordHash === password) {
      const { passwordHash: _, ...safeUser } = staffRecord;
      return { success: true, user: safeUser };
    }

    return { success: false, error: 'Invalid email address or password.' };
  }

  static getPermissions(role: UserRole): RolePermissions {
    return ROLE_PERMISSIONS_MAP[role] || ROLE_PERMISSIONS_MAP.writer;
  }

  static hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
    const permissions = this.getPermissions(role);
    return Boolean(permissions[permission]);
  }
}
