import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockVendors } from '@/data/mockData';
import { Vendor } from '@/types';
import { Plus } from 'lucide-react';

export default function Vendors() {
  const columns: Column<Vendor>[] = [
    { key: 'name', header: 'Vendor', cell: (v) => <span className="font-medium">{v.name}</span> },
    { key: 'contact', header: 'Contact', cell: (v) => v.contactPerson },
    { key: 'email', header: 'Email', cell: (v) => v.email },
    { key: 'stores', header: 'Stores', cell: (v) => v.storeCount },
    { key: 'orders', header: 'Total Orders', cell: (v) => v.totalOrders },
    { key: 'status', header: 'Status', cell: (v) => <StatusBadge status={v.status} /> },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Vendors" description="Manage vendor partnerships" actions={<Button><Plus className="h-4 w-4 mr-2" />Add Vendor</Button>} />
      <DataTable columns={columns} data={mockVendors} keyExtractor={(v) => v.id} />
    </DashboardLayout>
  );
}
