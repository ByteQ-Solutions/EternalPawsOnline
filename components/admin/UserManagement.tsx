'use client';

/**
 * Eternal Paws Platform - Editorial Team & User Management Center
 * Path: components/admin/UserManagement.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Lock,
  Mail,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { AdminUser } from '@/app/api/admin/users/route';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'editor' | 'fact_checker' | 'super_admin'>('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch {
      console.warn('Error fetching admin users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, name: newName, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Staff member "${newName}" invited successfully.` });
        setIsAddModalOpen(false);
        setNewEmail('');
        setNewName('');
        fetchUsers();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to add user.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error adding user.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
      }
    } catch {
      console.warn('Error updating user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this staff account?')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        alert(data.error || 'Cannot delete user.');
      }
    } catch {
      console.warn('Error deleting user');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge variant="forest" size="sm"><Shield className="w-3 h-3 mr-1" /> Super Admin</Badge>;
      case 'fact_checker':
        return <Badge variant="verified" size="sm"><CheckCircle2 className="w-3 h-3 mr-1" /> Fact Checker</Badge>;
      default:
        return <Badge variant="outline" size="sm">Editor</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add User Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-borderLight rounded-2xl p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-forestPrimary" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-inkPrimary">
              User & Editorial Staff Management
            </h2>
          </div>
          <p className="text-xs text-inkMuted mt-1">
            Manage admin permissions, assign fact-checker roles, and control access security.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="min-h-[44px] text-xs font-bold shadow-soft"
        >
          <UserPlus className="w-4 h-4 mr-1.5" /> Add Staff Member
        </Button>
      </div>

      {feedback && (
        <div
          role="alert"
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-error border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Users Table */}
      <Card className="bg-card border-borderLight rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cardMuted/80 border-b border-borderLight text-inkSubtle uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderLight/60">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-canvas/60 transition-colors">
                  <td className="p-4 font-bold text-inkPrimary flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-forestPrimary/10 text-forestPrimary font-bold flex items-center justify-center text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="p-4 font-mono text-inkMuted">{user.email}</td>
                  <td className="p-4">{getRoleBadge(user.role)}</td>
                  <td className="p-4">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-inkSubtle">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        title={user.status === 'active' ? 'Suspend Access' : 'Activate Access'}
                        className="p-1.5 rounded-lg border border-borderLight hover:bg-card text-inkMuted hover:text-inkPrimary transition-colors"
                      >
                        {user.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-700" />}
                      </button>

                      {user.role !== 'super_admin' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete Account"
                          className="p-1.5 rounded-lg border border-borderLight hover:bg-red-50 text-inkMuted hover:text-error transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inkPrimary/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md bg-card border border-borderLight rounded-2xl shadow-elevated p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-borderLight pb-3">
              <h3 className="font-serif text-lg font-bold text-inkPrimary flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-forestPrimary" /> Add Editorial Staff
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-lg text-inkMuted hover:text-inkPrimary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label htmlFor="staff-name" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                  Full Name
                </label>
                <input
                  id="staff-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. David Vance"
                  required
                  className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
                />
              </div>

              <div>
                <label htmlFor="staff-email" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                  Email Address
                </label>
                <input
                  id="staff-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. david.vance@eternal-paws.com"
                  required
                  className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
                />
              </div>

              <div>
                <label htmlFor="staff-role" className="block text-xs font-bold uppercase tracking-wider text-inkSubtle mb-1">
                  Permission Role
                </label>
                <select
                  id="staff-role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'editor' | 'fact_checker' | 'super_admin')}
                  className="w-full min-h-[44px] px-3 py-2 bg-canvas border border-borderLight rounded-xl text-sm focus-visible:ring-2 focus-visible:ring-forestPrimary"
                >
                  <option value="editor">Editor (Create, Polish & Publish)</option>
                  <option value="fact_checker">Fact Checker (Verify sources & confidence)</option>
                  <option value="super_admin">Super Admin (Full platform governance)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-borderLight text-xs font-bold text-inkMuted hover:text-inkPrimary"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="min-h-[44px] px-5 text-xs font-bold shadow-soft"
                >
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
