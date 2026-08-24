import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';

/**
 * Admin User Management API Route
 * Path: app/api/admin/users/route.ts
 * 
 * Supports:
 * - GET: List all admin & editorial staff users
 * - POST: Create new admin staff user
 * - PUT: Update user role / active status
 * - DELETE: Remove staff user
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'editor' | 'fact_checker';
  status: 'active' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
}

// In-memory initial staff seed
let memoryAdminUsers: AdminUser[] = [
  {
    id: 'user-admin-001',
    email: 'admin@eternal-paws.org',
    name: 'Super Admin',
    role: 'super_admin',
    status: 'active',
    lastLoginAt: new Date().toISOString(),
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-admin-002',
    email: 'elena.rostova@eternal-paws.com',
    name: 'Elena Rostova',
    role: 'fact_checker',
    status: 'active',
    lastLoginAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    createdAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'user-admin-003',
    email: 'sarah.miller@eternal-paws.com',
    name: 'Sarah Miller',
    role: 'editor',
    status: 'active',
    lastLoginAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    createdAt: '2026-03-01T00:00:00Z',
  },
];

export async function GET() {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('admin_users').select('*');
      if (data && data.length > 0) {
        return NextResponse.json({ success: true, users: data });
      }
    } catch (e) {
      console.warn('Supabase admin_users fetch fallback:', e);
    }
  }

  return NextResponse.json({ success: true, users: memoryAdminUsers });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, role } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email and Name are required.' },
        { status: 400 }
      );
    }

    const newUser: AdminUser = {
      id: `user-admin-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: role || 'editor',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    memoryAdminUsers.push(newUser);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('admin_users').insert({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          status: newUser.status,
          created_at: newUser.createdAt,
        });
      } catch (e) {
        console.warn('Supabase insert note:', e);
      }
    }

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown user creation error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, role, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    const user = memoryAdminUsers.find((u) => u.id === id);
    if (user) {
      if (role) user.role = role;
      if (status) user.status = status;
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('admin_users').update({ role, status }).eq('id', id);
      } catch (e) {
        console.warn('Supabase update note:', e);
      }
    }

    return NextResponse.json({ success: true, message: 'User updated successfully.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown user update error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    // Protect Super Admin from deletion
    const target = memoryAdminUsers.find((u) => u.id === id);
    if (target?.role === 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete the primary Super Admin account.' },
        { status: 403 }
      );
    }

    memoryAdminUsers = memoryAdminUsers.filter((u) => u.id !== id);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('admin_users').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete note:', e);
      }
    }

    return NextResponse.json({ success: true, message: 'User removed successfully.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown delete error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
