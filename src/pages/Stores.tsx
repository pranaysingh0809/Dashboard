import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockStores } from '@/data/mockData';
import { Store } from '@/types';
import { Plus } from 'lucide-react';

export default function Stores() {
  const columns: Column<Store>[] = [
    { key: 'name', header: 'Store', cell: (s) => <span className="font-medium">{s.name}</span> },
    { key: 'vendor', header: 'Vendor', cell: (s) => s.vendorName },
    { key: 'city', header: 'City', cell: (s) => s.city },
    { key: 'contact', header: 'Contact', cell: (s) => s.contactPerson },
    { key: 'phone', header: 'Phone', cell: (s) => s.phone },
    { key: 'status', header: 'Status', cell: (s) => <StatusBadge status={s.status} /> },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Stores" description="Manage store locations" actions={<Button><Plus className="h-4 w-4 mr-2" />Add Store</Button>} />
      <DataTable columns={columns} data={mockStores} keyExtractor={(s) => s.id} />
    </DashboardLayout>
  );
}
