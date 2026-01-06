// src/pages/Users/Users.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserForm } from '@/components/ui/UserForm';
import { DeleteUserDialog } from '@/components/ui/DeleteUserDialog';
import { useUsers } from '@/hooks/use-users';
import { useVendors } from '@/hooks/use-vendors';
import { User, UserRole, CreateUserPayload } from '@/types';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  RefreshCw, 
  AlertCircle,
  Users as UsersIcon,
  Shield,
  UserCog,
  Truck,
  Store,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
  ADMIN: <Shield className="h-3 w-3" />,
  USER: <UsersIcon className="h-3 w-3" />,
  MANAGER: <UserCog className="h-3 w-3" />,
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
  MANAGER: <UserCog className="h-3 w-3" />,
  PICKUP: <Truck className="h-3 w-3" />,
  STORE_MANAGER: <Store className="h-3 w-3" />,
};

export default function Users() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    users,
    loading,
    error,
    refetch,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const { vendors } = useVendors();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleViewDetails = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleCreate = async (data: CreateUserPayload) => {
    try {
      setIsSubmitting(true);
      await createUser(data);
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
      setIsFormOpen(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create user',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Partial<User>) => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await updateUser(selectedUser.id, data);
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
      setIsFormOpen(false);
      setSelectedUser(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update user',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);
      await deleteUser(selectedUser.id);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      setIsDeleteOpen(false);
      setSelectedUser(null);
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

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedUser(null);
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (user) => (
        <button
          onClick={() => handleViewDetails(user.id)}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
        >
          {user.name}
        </button>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      cell: (user) => (
        <span className="text-gray-600">{user.email}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (user) => (
        <span className="text-gray-600">{user.phone || '-'}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cell: (user) => (
        <Badge 
          variant="outline" 
          className={`${roleColors[user.role]} flex items-center gap-1.5 w-fit`}
        >
          {roleIcons[user.role]}
          {roleLabels[user.role]}
        </Badge>
      ),
    },
    {
      key: 'subRole',
      header: 'Sub Role',
      cell: (user) => (
        user.subRole ? (
          <Badge 
            variant="outline" 
            className={`${subRoleColors[user.subRole]} flex items-center gap-1.5 w-fit`}
          >
            {subRoleIcons[user.subRole]}
            {subRoleLabels[user.subRole]}
          </Badge>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      cell: (user) => (
        <span className="text-gray-500 text-sm">
          {user.createdAt 
            ? new Date(user.createdAt).toLocaleDateString() 
            : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (user) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewDetails(user.id)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(user)}
            title="Edit User"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(user)}
            title="Delete User"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader 
          title="Users" 
          description="Manage team members and roles" 
        />
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-gray-500">Loading users...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <PageHeader 
          title="Users" 
          description="Manage team members and roles" 
        />
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <span className="text-lg">{error}</span>
          </div>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Users"
        description="Manage team members and roles"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(user) => user.id}
      />

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <UsersIcon className="h-12 w-12 mb-4 text-gray-300" />
          <p className="mb-4">No users found</p>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First User
          </Button>
        </div>
      )}

      <UserForm
        user={selectedUser}
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={selectedUser ? handleUpdate : handleCreate}
        isLoading={isSubmitting}
        vendors={vendors.map(v => ({ id: v.id, name: v.name }))}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={isDeleteOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
}