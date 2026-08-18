/**
 * Eternal Paws Platform - Authentication & Role-Based Access Control (RBAC) Types
 * Path: src/lib/auth/types.ts
 */

export type UserRole = 'super_admin' | 'editor' | 'fact_checker' | 'writer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

export interface RolePermissions {
  canPublishStory: boolean;
  canApproveVerification: boolean;
  canManageRedirects: boolean;
  canManageUsers: boolean;
  canReviewSubmissions: boolean;
}

export const ROLE_PERMISSIONS_MAP: Record<UserRole, RolePermissions> = {
  super_admin: {
    canPublishStory: true,
    canApproveVerification: true,
    canManageRedirects: true,
    canManageUsers: true,
    canReviewSubmissions: true,
  },
  editor: {
    canPublishStory: true,
    canApproveVerification: true,
    canManageRedirects: true,
    canManageUsers: false,
    canReviewSubmissions: true,
  },
  fact_checker: {
    canPublishStory: false,
    canApproveVerification: true,
    canManageRedirects: false,
    canManageUsers: false,
    canReviewSubmissions: true,
  },
  writer: {
    canPublishStory: false,
    canApproveVerification: false,
    canManageRedirects: false,
    canManageUsers: false,
    canReviewSubmissions: false,
  },
};
