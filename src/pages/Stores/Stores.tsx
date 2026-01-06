// src/pages/Stores.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { StoreForm } from '@/components/ui/StoreForm';
import { DeleteStoreDialog } from '@/components/ui/DeleteStoreDialog';
import { useStores } from '@/hooks/use-stores';
import { Store } from '@/types';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Stores() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch stores using custom hook
  const {
    stores,
    loading,
    error,
    refetch,
    createStore,
    updateStore,
    deleteStore,
  } = useStores();

  // Local state for dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // Handler Functions
  // ==========================================

  const handleAddNew = () => {
    setSelectedStore(null);
    setIsFormOpen(true);
  };

  const handleEdit = (store: Store) => {
    setSelectedStore(store);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (store: Store) => {
    setSelectedStore(store);
    setIsDeleteOpen(true);
  };

  const handleViewDetails = (storeId: string) => {
    navigate(`/stores/${storeId}`);
  };

  const handleCreate = async (data: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      await createStore(data);
      toast({
        title: 'Success',
        description: 'Store created successfully',
      });
      setIsFormOpen(false);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create store',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: Partial<Store>) => {
    if (!selectedStore) return;

    try {
      setIsSubmitting(true);
      await updateStore(selectedStore.id, data);
      toast({
        title: 'Success',
        description: 'Store updated successfully',
      });
      setIsFormOpen(false);
      setSelectedStore(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update store',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedStore) return;

    try {
      setIsSubmitting(true);
      await deleteStore(selectedStore.id);
      toast({
        title: 'Success',
        description: 'Store deleted successfully',
      });
      setIsDeleteOpen(false);
      setSelectedStore(null);
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

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedStore(null);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedStore(null);
  };

  // ==========================================
  // Table Columns Configuration
  // ==========================================

  const columns: Column<Store>[] = [
    {
      key: 'name',
      header: 'Store Name',
      cell: (store) => (
        <button
          onClick={() => handleViewDetails(store.id)}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
        >
          {store.name}
        </button>
      ),
    },
    {
      key: 'vendorId',
      header: 'Vendor ID',
      cell: (store) => (
        <span className="text-sm font-mono text-gray-600">{store.vendorId}</span>
      ),
    },
    {
      key: 'address',
      header: 'Address',
      cell: (store) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="truncate max-w-[150px]">{store.address}</span>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'City',
      cell: (store) => store.city,
    },
    {
      key: 'state',
      header: 'State',
      cell: (store) => store.state,
    },
    {
      key: 'pincode',
      header: 'Pincode',
      cell: (store) => store.pincode,
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (store) => store.phone || '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (store) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewDetails(store.id)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(store)}
            title="Edit Store"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(store)}
            title="Delete Store"
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
        <PageHeader title="Stores" description="Manage store locations" />
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-gray-500">Loading stores...</span>
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
        <PageHeader title="Stores" description="Manage store locations" />
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
        title="Stores"
        description="Manage store locations"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Store
            </Button>
          </div>
        }
      />

      {/* Stores Table */}
      <DataTable
        columns={columns}
        data={stores}
        keyExtractor={(store) => store.id}
      />

      {/* Empty State */}
      {stores.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="mb-4">No stores found</p>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Store
          </Button>
        </div>
      )}

      {/* Create/Edit Form Dialog */}
      <StoreForm
        store={selectedStore}
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={selectedStore ? handleUpdate : handleCreate}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteStoreDialog
        store={selectedStore}
        open={isDeleteOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
}