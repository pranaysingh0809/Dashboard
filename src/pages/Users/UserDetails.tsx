// src/pages/Users/UserDetails.tsx

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserForm } from '@/components/ui/UserForm';
import { DeleteUserDialog } from '@/components/ui/DeleteUserDialog';
import { useUser } from '@/hooks/use-users';
import { useVendors } from '@/hooks/use-vendors';
import { userApi } from '@/services/userApi';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  RefreshCw,
  AlertCircle,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Hash,
  Shield,
  UserCog,
  Users as UsersIcon,
  Clock,
  Building2,
  Store,
  Truck,
} from 'lucide-react';

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Admin',
  USER: 'User',
  MANAGER: 'Manager',
};

const roleColors: Record<UserRole, string> = {
  ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
  USER: 'bg-blue-100 text-blue-800 border-blue-200',
  MANAGER: 'bg-green-100 text-green-800 border-green-200',
};

const roleIcons: Record<UserRole, React.ReactNode> = {
  ADMIN: <Shield className="h-4 w-4" />,
  USER: <UsersIcon className="h-4 w-4" />,
  MANAGER: <UserCog className="h-4 w-4" />,
};

const subRoleLabels: Record<string, string> = {
  MANAGER: 'Manager',
  PICKUP: 'Pickup',
  STORE_MANAGER: 'Store Manager',
};

const subRoleColors: Record<string, string> = {
  MANAGER: 'bg-orange-100 text-orange-800 border-orange-200',
  PICKUP: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  STORE_MANAGER: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

const subRoleIcons: Record<string, React.ReactNode> = {
  MANAGER: <UserCog className="h-4 w-4" />,
  PICKUP: <Truck className="h-4 w-4" />,
  STORE_MANAGER: <Store className="h-4 w-4" />,
};

const roleDescriptions: Record<UserRole, string> = {
  ADMIN: 'Full system access with ability to manage all users, settings, and configurations.',
  USER: 'Standard user access with basic functionality.',
  MANAGER: 'Access to manage operations, teams, and view reports.',
};

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user, loading, error, refetch, updateUser } = useUser(id!);
  const { vendors } = useVendors();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (data: Partial<typeof user>) => {
    try {
      setIsSubmitting(true);
      await updateUser(data);
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      await userApi.delete(user.id);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      navigate('/users');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-gray-500">Loading user details...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <span className="text-lg">{error || 'User not found'}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/users')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const vendorName = user.vendorId 
    ? vendors.find(v => v.id === user.vendorId)?.name || user.vendorId 
    : null;

  return (
    <DashboardLayout>
      <PageHeader
        title={user.name}
        description="User details and management"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/users')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="outline" onClick={() => setIsFormOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-gray-500" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">User ID</label>
                <p className="text-sm font-mono mt-1 text-gray-700">{user.id}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-lg font-semibold mt-1">{user.name}</p>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1">
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                    {user.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="mt-1">
                  {user.phone ? (
                    <a href={`tel:${user.phone}`} className="hover:text-blue-600">
                      {user.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role & Assignment Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-500" />
              Role & Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <div className="mt-2">
                <Badge 
                  variant="outline" 
                  className={`${roleColors[user.role]} flex items-center gap-1.5 w-fit text-sm py-1 px-3`}
                >
                  {roleIcons[user.role]}
                  {roleLabels[user.role]}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2">{roleDescriptions[user.role]}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Sub Role</label>
              <div className="mt-2">
                {user.subRole ? (
                  <Badge 
                    variant="outline" 
                    className={`${subRoleColors[user.subRole]} flex items-center gap-1.5 w-fit text-sm py-1 px-3`}
                  >
                    {subRoleIcons[user.subRole]}
                    {subRoleLabels[user.subRole]}
                  </Badge>
                ) : (
                  <span className="text-gray-400">No sub role assigned</span>
                )}
              </div>
            </div>

            {user.vendorId && (
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 mt-1 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Assigned Vendor</label>
                  <p className="mt-1">{vendorName}</p>
                </div>
              </div>
            )}

            {user.storeId && (
              <div className="flex items-start gap-3">
                <Store className="h-5 w-5 mt-1 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Assigned Store</label>
                  <p className="mt-1 font-mono text-sm">{user.storeId}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timestamps Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-1 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Created</label>
                  <p className="mt-1">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString('en-US', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })
                      : 'Not available'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-1 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="mt-1">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleString('en-US', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })
                      : 'Never updated'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Overview Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-500" />
            Permissions Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Dashboard</h4>
              <p className="text-sm text-gray-600">
                {user.role === 'ADMIN' 
                  ? '✓ Full access to dashboard metrics and analytics'
                  : user.role === 'MANAGER'
                    ? '✓ Access to team metrics and reports'
                    : '✓ Basic dashboard view'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Orders</h4>
              <p className="text-sm text-gray-600">
                {user.role === 'ADMIN' 
                  ? '✓ Full CRUD operations on all orders'
                  : user.role === 'MANAGER'
                    ? '✓ View and manage assigned orders'
                    : user.subRole === 'PICKUP'
                      ? '✓ Update status for pickup orders'
                      : '✓ View assigned orders only'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">User Management</h4>
              <p className="text-sm text-gray-600">
                {user.role === 'ADMIN' 
                  ? '✓ Full access to manage all users'
                  : user.role === 'MANAGER'
                    ? '✓ View users and manage team members'
                    : '✗ No access to user management'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserForm
        user={user}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
        vendors={vendors.map(v => ({ id: v.id, name: v.name }))}
      />

      <DeleteUserDialog
        user={user}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
}