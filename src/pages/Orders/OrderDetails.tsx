// src/pages/Orders/OrderDetails.tsx

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  RefreshCw, 
  Package, 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  CreditCard,
  Smartphone,
  AlertCircle,
  Clock,
  Building2,
  ExternalLink
} from 'lucide-react';
import { FlattenedOrder } from '@/types';
import { orderApi } from '@/services/orderApi';

// Helper to format date
function formatDate(dateString: string | undefined): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

// Helper to format date with time
function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

// Helper to format price
function formatPrice(price: string | number | undefined): string {
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
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Error component
function ErrorDisplay({ error, onRetry, onBack }: { error: string; onRetry: () => void; onBack: () => void }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load order details</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Info row component
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium break-words">{value || '-'}</p>
      </div>
    </div>
  );
}

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order from navigation state (passed from Orders list)
  const orderFromState = location.state?.order as FlattenedOrder | undefined;
  
  const [order, setOrder] = useState<FlattenedOrder | null>(orderFromState || null);
  const [loading, setLoading] = useState(!orderFromState);
  const [error, setError] = useState<string | null>(null);

  // Fetch order if not passed via state
  const fetchOrder = async () => {
    if (!id) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get from grouped data
      const foundOrder = await orderApi.getByIdFromGrouped(id);
      
      if (foundOrder) {
        // Convert to FlattenedOrder format
        setOrder({
          id: foundOrder.id,
          oId: foundOrder.oId,
          status: foundOrder.status,
          deviceBrand: foundOrder.deviceBrand,
          deviceModel: foundOrder.deviceModel,
          devicePrice: foundOrder.devicePrice,
          createdAt: foundOrder.createdAt,
          storeName: foundOrder.store?.name || 'Unknown Store',
          storeCity: foundOrder.store?.city || '',
          storeAddress: foundOrder.store?.address || '',
          vendorName: foundOrder.vendor?.name || 'Unknown Vendor',
          vendorId: foundOrder.vendor?.id || '',
          storeId: foundOrder.store?.id || '',
        });
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderFromState && id) {
      fetchOrder();
    }
  }, [id, orderFromState]);

  const handleBack = () => {
    navigate('/orders');
  };

  const handleRefresh = () => {
    setOrder(null);
    fetchOrder();
  };

  return (
    <DashboardLayout>
      <PageHeader 
        title={order ? `Order ${order.oId || order.id.slice(0, 8)}` : 'Order Details'}
        description={order ? `Created on ${formatDate(order.createdAt)}` : 'Loading order details...'}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        } 
      />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorDisplay error={error} onRetry={handleRefresh} onBack={handleBack} />
      ) : order ? (
        <div className="space-y-6">
          {/* Status Banner */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{order.oId || order.id}</h2>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{formatPrice(order.devicePrice)}</p>
                    <p className="text-sm text-muted-foreground">Device Price</p>
                  </div>
                  <StatusBadge status={mapStatusForBadge(order.status) as any} className="text-sm px-4 py-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Device Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Device Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow icon={Smartphone} label="Brand" value={order.deviceBrand || '-'} />
                <Separator />
                <InfoRow icon={Smartphone} label="Model" value={order.deviceModel || '-'} />
                <Separator />
                <InfoRow icon={CreditCard} label="Price" value={formatPrice(order.devicePrice)} />
              </CardContent>
            </Card>

            {/* Store Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow icon={Store} label="Store Name" value={order.storeName || '-'} />
                <Separator />
                <InfoRow icon={MapPin} label="City" value={order.storeCity || '-'} />
                <Separator />
                <InfoRow icon={MapPin} label="Address" value={order.storeAddress || '-'} />
                {order.storeId && (
                  <>
                    <Separator />
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/stores/${order.storeId}`)}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Store Details
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Vendor Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Vendor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow icon={Building2} label="Vendor Name" value={order.vendorName || '-'} />
                {order.vendorId && (
                  <>
                    <Separator />
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/vendors/${order.vendorId}`)}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Vendor Details
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow icon={Calendar} label="Created At" value={formatDateTime(order.createdAt)} />
                <Separator />
                <InfoRow icon={Package} label="Current Status" value={
                  <StatusBadge status={mapStatusForBadge(order.status) as any} />
                } />
              </CardContent>
            </Card>
          </div>

          {/* Additional Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="font-semibold">{order.oId || order.id.slice(0, 8)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Device</p>
                  <p className="font-semibold">{order.deviceBrand} {order.deviceModel}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Store</p>
                  <p className="font-semibold">{order.storeName}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="font-semibold text-primary">{formatPrice(order.devicePrice)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </DashboardLayout>
  );
}