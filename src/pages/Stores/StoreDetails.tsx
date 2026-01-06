// src/pages/StoreDetails.tsx

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoreForm } from '@/components/ui/StoreForm';
import { DeleteStoreDialog } from '@/components/ui/DeleteStoreDialog';
import { useStore } from '@/hooks/use-stores';
import { storeApi } from '@/services/storeApi';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  RefreshCw,
  AlertCircle,
  Store,
  MapPin,
  Phone,
  Calendar,
  Hash,
  Building2,
} from 'lucide-react';

export default function StoreDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { store, loading, error, refetch, updateStore } = useStore(id!);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (data: Partial<typeof store>) => {
    try {
      setIsSubmitting(true);
      await updateStore(data);
      toast({
        title: 'Success',
        description: 'Store updated successfully',
      });
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update store',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!store) return;

    try {
      setIsSubmitting(true);
      await storeApi.delete(store.id);
      toast({
        title: 'Success',
        description: 'Store deleted successfully',
      });
      navigate('/stores');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete store',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-gray-500">Loading store details...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error State
  if (error || !store) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <span className="text-lg">{error || 'Store not found'}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/stores')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stores
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

  // Main Content
  return (
    <DashboardLayout>
      <PageHeader
        title={store.name}
        description="Store details and management"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/stores')}>
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
        {/* Store Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-gray-500" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Store ID */}
            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Store ID
                </label>
                <p className="text-sm font-mono mt-1 text-gray-700">{store.id}</p>
              </div>
            </div>

            {/* Store Name */}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Store Name
              </label>
              <p className="text-lg font-semibold mt-1">{store.name}</p>
            </div>

            {/* Vendor ID */}
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Vendor ID
                </label>
                <p className="text-sm font-mono mt-1 text-gray-700">{store.vendorId}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="mt-1">
                  {store.phone ? (
                    <a
                      href={`tel:${store.phone}`}
                      className="hover:text-blue-600"
                    >
                      {store.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Address */}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Address
              </label>
              <p className="text-lg mt-1">{store.address}</p>
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  City
                </label>
                <p className="text-lg mt-1">{store.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  State
                </label>
                <p className="text-lg mt-1">{store.state}</p>
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Pincode
              </label>
              <p className="text-lg mt-1">{store.pincode}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timestamps Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Created At
                </label>
                <p className="text-lg mt-1">
                  {store.createdAt
                    ? new Date(store.createdAt).toLocaleString()
                    : 'Not available'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Updated At
                </label>
                <p className="text-lg mt-1">
                  {store.updatedAt
                    ? new Date(store.updatedAt).toLocaleString()
                    : 'Not available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Form Dialog */}
      <StoreForm
        store={store}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteStoreDialog
        store={store}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
}