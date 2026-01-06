import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Filter, RefreshCw, Package, Store, AlertCircle } from 'lucide-react';
import { useOrders } from '@/hooks/use-orders';
import { FlattenedOrder } from '@/types';

// Status options based on API documentation
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REJECTED', label: 'Rejected' },
];

// Helper to format date
function formatDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

// Helper to format price
function formatPrice(price: string | number): string {
  if (!price) return '-';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return String(price);
  return `₹${numPrice.toLocaleString('en-IN')}`;
}

// Map API status to StatusBadge compatible status
function mapStatusForBadge(status: string): string {
  const statusMap: Record<string, string> = {
    'PENDING': 'pending',
    'PROCESSING': 'in_transit',
    'COMPLETED': 'completed',
    'CANCELLED': 'cancelled',
    'REJECTED': 'rejected',
    'CREATED': 'created',
    'APPROVED': 'approved',
    'ASSIGNED': 'assigned',
    'PICKED_UP': 'picked_up',
    'DELIVERED': 'delivered',
    'VERIFIED': 'verified',
  };
  return statusMap[status?.toUpperCase()] || status?.toLowerCase() || 'pending';
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Error component
function ErrorDisplay({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load orders</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Stats cards component
function StatsCards({ totalOrders, totalStores }: { totalOrders: number; totalStores: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Store className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Stores</p>
            <p className="text-2xl font-bold">{totalStores.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Orders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  
  const { 
    orders, 
    loading, 
    error, 
    totalOrders, 
    totalStores, 
    refetch,
    fetchByStatus 
  } = useOrders();

  // Handle status filter change
  useEffect(() => {
    if (statusFilter === 'all') {
      fetchByStatus(undefined);
    } else {
      fetchByStatus(statusFilter);
    }
  }, [statusFilter, fetchByStatus]);

  // Filter orders by search term (client-side filtering)
  const filteredOrders = orders.filter((order) => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    return (
      order.oId?.toLowerCase().includes(searchLower) ||
      order.deviceBrand?.toLowerCase().includes(searchLower) ||
      order.deviceModel?.toLowerCase().includes(searchLower) ||
      order.storeName?.toLowerCase().includes(searchLower) ||
      order.vendorName?.toLowerCase().includes(searchLower)
    );
  });

  // Handle row click to navigate to order details
  const handleOrderClick = (order: FlattenedOrder) => {
    navigate(`/orders/${order.id}`, { state: { order } });
  };

  // Table columns definition
  const columns: Column<FlattenedOrder>[] = [
    { 
      key: 'oId', 
      header: 'Order ID', 
      cell: (order) => (
        <span className="font-medium text-primary">{order.oId || order.id.slice(0, 8)}</span>
      ) 
    },
    { 
      key: 'device', 
      header: 'Device', 
      cell: (order) => (
        <div>
          <div className="font-medium">{order.deviceBrand || '-'}</div>
          <div className="text-sm text-muted-foreground">{order.deviceModel || '-'}</div>
        </div>
      ) 
    },
    { 
      key: 'store', 
      header: 'Store', 
      cell: (order) => (
        <div>
          <div className="font-medium">{order.storeName}</div>
          <div className="text-sm text-muted-foreground">{order.storeCity}</div>
        </div>
      ) 
    },
    { 
      key: 'vendor', 
      header: 'Vendor', 
      cell: (order) => order.vendorName || '-'
    },
    { 
      key: 'price', 
      header: 'Price', 
      cell: (order) => (
        <span className="font-medium">{formatPrice(order.devicePrice)}</span>
      ) 
    },
    { 
      key: 'createdAt', 
      header: 'Created', 
      cell: (order) => formatDate(order.createdAt)
    },
    { 
      key: 'status', 
      header: 'Status', 
      cell: (order) => (
        <StatusBadge status={mapStatusForBadge(order.status) as any} />
      ) 
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader 
        title="Orders" 
        description="Manage phone buyback orders" 
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={refetch} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        } 
      />

      {/* Stats Cards */}
      {!loading && !error && (
        <StatsCards totalOrders={totalOrders} totalStores={totalStores} />
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by order ID, device, store, or vendor..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-10" 
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorDisplay error={error} onRetry={refetch} />
      ) : (
        <>
          {/* Results count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredOrders.length} of {orders.length} orders
            {statusFilter !== 'all' && ` (filtered by ${statusFilter})`}
          </div>
          
          <DataTable 
            columns={columns} 
            data={filteredOrders} 
            keyExtractor={(order) => order.id}
            onRowClick={handleOrderClick}
            emptyMessage={
              search 
                ? "No orders match your search criteria" 
                : "No orders found"
            }
          />
        </>
      )}
    </DashboardLayout>
  );
}