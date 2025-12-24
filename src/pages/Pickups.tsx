import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockPickups } from '@/data/mockData';
import { Pickup } from '@/types';
import { Calendar } from 'lucide-react';

export default function Pickups() {
  const columns: Column<Pickup>[] = [
    { key: 'order', header: 'Order #', cell: (p) => <span className="font-medium">{p.orderNumber}</span> },
    { key: 'manager', header: 'Pickup Manager', cell: (p) => p.pickupManagerName },
    { key: 'store', header: 'Store', cell: (p) => p.storeName },
    { key: 'date', header: 'Scheduled', cell: (p) => `${p.scheduledDate} ${p.scheduledTime}` },
    { key: 'status', header: 'Status', cell: (p) => <StatusBadge status={p.status} /> },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Pickups" description="Manage pickup schedules and assignments" actions={<Button><Calendar className="h-4 w-4 mr-2" />Schedule Pickup</Button>} />
      <DataTable columns={columns} data={mockPickups} keyExtractor={(p) => p.id} />
    </DashboardLayout>
  );
}
