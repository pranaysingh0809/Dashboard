import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import { mockOrders } from '@/data/mockData';
import { Order } from '@/types';

export default function Orders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.deviceModel.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Order>[] = [
    { key: 'orderNumber', header: 'Order #', cell: (order) => <span className="font-medium">{order.orderNumber}</span> },
    { key: 'customer', header: 'Customer', cell: (order) => order.customerName },
    { key: 'device', header: 'Device', cell: (order) => `${order.deviceBrand} ${order.deviceModel}` },
    { key: 'store', header: 'Store', cell: (order) => order.storeName },
    { key: 'price', header: 'Price', cell: (order) => `₹${order.expectedPrice.toLocaleString()}` },
    { key: 'status', header: 'Status', cell: (order) => <StatusBadge status={order.status} /> },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Orders" description="Manage phone buyback orders" actions={<Button><Plus className="h-4 w-4 mr-2" />New Order</Button>} />
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="pending_approval">Pending Approval</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="picked_up">Picked Up</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={filteredOrders} keyExtractor={(order) => order.id} />
    </DashboardLayout>
  );
}
