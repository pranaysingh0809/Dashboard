// src/pages/Vendors.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { VendorForm } from '@/components/ui/VendorForm';
import { DeleteVendorDialog } from '@/components/ui/DeleteVendorDialog';
import { useVendors } from '@/hooks/use-vendors';
import { Vendor } from '@/types';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function Vendors() {
  // Navigation
  const navigate = useNavigate();
  
  // Toast notifications
  const { toast } = useToast();
  
  // Fetch vendors using custom hook
  const {
    vendors,
    loading,
    error,
    refetch,
    createVendor,
    updateVendor,
    deleteVendor,
  } = useVendors();

  // Local state for dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // Handler Functions
  // ==========================================

  // Open form for creating new vendor
  const handleAddNew = () => {
    setSelectedVendor(null);
    setIsFormOpen(true);
  };

  // Open form for editing existing vendor
  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsDeleteOpen(true);
  };

  // Navigate to vendor details page
  const handleViewDetails = (vendorId: string) => {
    navigate(`/vendors/${vendorId}`);
  };

  // Create new vendor
  const handleCreate = async (data: Omit<Vendor, 'id'>) => {
    try {
      setIsSubmitting(true);
      await createVendor(data);
      toast({
        title: 'Success',
        description: 'Vendor created successfully',
      });
      setIsFormOpen(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create vendor',
        variant: 'destructive',
      });
      throw err; // Re-throw to prevent form from closing
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update existing vendor
  const handleUpdate = async (data: Partial<Vendor>) => {
    if (!selectedVendor) return;
    
    try {
      setIsSubmitting(true);
      await updateVendor(selectedVendor.id, data);
      toast({
        title: 'Success',
        description: 'Vendor updated successfully',
      });
      setIsFormOpen(false);
      setSelectedVendor(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update vendor',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete vendor
  const handleDelete = async () => {
    if (!selectedVendor) return;
    
    try {
      setIsSubmitting(true);
      await deleteVendor(selectedVendor.id);
      toast({
        title: 'Success',
        description: 'Vendor deleted successfully',
      });
      setIsDeleteOpen(false);
      setSelectedVendor(null);
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

  // Close form dialog
  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedVendor(null);
  };

  // Close delete dialog
  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedVendor(null);
  };

  // ==========================================
  // Table Columns Configuration
  // ==========================================

  const columns: Column<Vendor>[] = [
  {
    key: 'name',
    header: 'Vendor',
    cell: (vendor) => (
      <button
        onClick={() => handleViewDetails(vendor.id)}
        className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
      >
        {vendor.name}
      </button>
    ),
  },
  {
    key: 'contactEmail',
    header: 'Email',
    cell: (vendor) => vendor.contactEmail || vendor.email || '-',
  },
  {
    key: 'contactPhone',
    header: 'Phone',
    cell: (vendor) => vendor.contactPhone || vendor.phone || '-',
  },
  {
    key: 'gradingSystem',
    header: 'Grading System',
    cell: (vendor) => vendor.gradingSystem || '-',
  },
  {
    key: 'createdAt',
    header: 'Created',
    cell: (vendor) => vendor.createdAt 
      ? new Date(vendor.createdAt).toLocaleDateString() 
      : '-',
  },
  {
    key: 'actions',
    header: 'Actions',
    cell: (vendor) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleViewDetails(vendor.id)}
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleEdit(vendor)}
          title="Edit Vendor"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteClick(vendor)}
          title="Delete Vendor"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

  // ==========================================
  // Render Loading State
  // ==========================================

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader 
          title="Vendors" 
          description="Manage vendor partnerships" 
        />
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-gray-500">Loading vendors...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // Render Error State
  // ==========================================

  if (error) {
    return (
      <DashboardLayout>
        <PageHeader 
          title="Vendors" 
          description="Manage vendor partnerships" 
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

  // ==========================================
  // Render Main Content
  // ==========================================

  return (
    <DashboardLayout>
      <PageHeader
        title="Vendors"
        description="Manage vendor partnerships"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        }
      />

      {/* Vendors Table */}
      <DataTable
        columns={columns}
        data={vendors}
        keyExtractor={(vendor) => vendor.id}
      />

      {/* Empty State */}
      {vendors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="mb-4">No vendors found</p>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Vendor
          </Button>
        </div>
      )}

      {/* Create/Edit Form Dialog */}
      <VendorForm
        vendor={selectedVendor}
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={selectedVendor ? handleUpdate : handleCreate}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteVendorDialog
        vendor={selectedVendor}
        open={isDeleteOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
}