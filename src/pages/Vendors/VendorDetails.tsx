// src/pages/VendorDetails.tsx

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorForm } from '@/components/ui/VendorForm';
import { DeleteVendorDialog } from '@/components/ui/DeleteVendorDialog';
import { useVendor } from '@/hooks/use-vendors';
import { vendorApi } from '@/services/vendorApi';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  RefreshCw,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  Calendar,
  Hash,
  Settings,
} from 'lucide-react';

export default function VendorDetails() {
  // Get vendor ID from URL params
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch single vendor using custom hook
  const { vendor, loading, error, refetch, updateVendor } = useVendor(id!);

  // Local state for dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // Handler Functions
  // ==========================================

  const handleUpdate = async (data: Partial<typeof vendor>) => {
    try {
      setIsSubmitting(true);
      await updateVendor(data);
      toast({
        title: 'Success',
        description: 'Vendor updated successfully',
      });
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update vendor',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!vendor) return;

    try {
      setIsSubmitting(true);
      await vendorApi.delete(vendor.id);
      toast({
        title: 'Success',
        description: 'Vendor deleted successfully',
      });
      navigate('/vendors');
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete vendor',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // Render Loading State
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-gray-500">Loading vendor details...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // Render Error State
  // ==========================================

  if (error || !vendor) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <span className="text-lg">{error || 'Vendor not found'}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/vendors')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vendors
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

  // ==========================================
  // Render Main Content
  // ==========================================

  return (
    <DashboardLayout>
      {/* Page Header */}
      <PageHeader
        title={vendor.name}
        description="Vendor details and management"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/vendors')}>
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

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Vendor Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              Vendor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vendor ID */}
            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Vendor ID
                </label>
                <p className="text-sm font-mono mt-1 text-gray-700">{vendor.id}</p>
              </div>
            </div>

            {/* Vendor Name */}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Vendor Name
              </label>
              <p className="text-lg font-semibold mt-1">{vendor.name}</p>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1">
                  {vendor.contactEmail ? (
                    <a
                      href={`mailto:${vendor.contactEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {vendor.contactEmail}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
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
                  {vendor.contactPhone ? (
                    <a
                      href={`tel:${vendor.contactPhone}`}
                      className="hover:text-blue-600"
                    >
                      {vendor.contactPhone}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings & Timestamps Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-500" />
              Settings & Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Grading System */}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Grading System
              </label>
              <p className="text-lg font-semibold mt-1">
                {vendor.gradingSystem !== undefined ? vendor.gradingSystem : 'Not set'}
              </p>
            </div>

            {/* Created At */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Created At
                </label>
                <p className="mt-1">
                  {vendor.createdAt
                    ? new Date(vendor.createdAt).toLocaleString()
                    : 'Not available'}
                </p>
              </div>
            </div>

            {/* Updated At */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Updated At
                </label>
                <p className="mt-1">
                  {vendor.updatedAt
                    ? new Date(vendor.updatedAt).toLocaleString()
                    : 'Not available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Form Dialog */}
      <VendorForm
        vendor={vendor}
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleUpdate}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteVendorDialog
        vendor={vendor}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
}