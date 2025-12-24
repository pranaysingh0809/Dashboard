import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockUsers } from '@/data/mockData';
import { User, UserRole } from '@/types';
import { Plus } from 'lucide-react';

const roleLabels: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  pickup_manager: 'Pickup Manager',
};

export default function Users() {
  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', cell: (u) => <span className="font-medium">{u.name}</span> },
    { key: 'email', header: 'Email', cell: (u) => u.email },
    { key: 'phone', header: 'Phone', cell: (u) => u.phone },
    { key: 'role', header: 'Role', cell: (u) => <Badge variant="secondary">{roleLabels[u.role]}</Badge> },
    { key: 'status', header: 'Status', cell: (u) => <StatusBadge status={u.status} /> },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Users" description="Manage team members and roles" actions={<Button><Plus className="h-4 w-4 mr-2" />Invite User</Button>} />
      <DataTable columns={columns} data={mockUsers} keyExtractor={(u) => u.id} />
    </DashboardLayout>
  );
}
