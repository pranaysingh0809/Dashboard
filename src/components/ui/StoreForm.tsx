// src/components/ui/StoreForm.tsx

import { useState, useEffect } from 'react';
import { Store } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface StoreFormProps {
  store?: Store | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Store, 'id' | 'createdAt' | 'updatedAt'> | Partial<Store>) => Promise<void>;
  isLoading?: boolean;
}

export function StoreForm({
  store,
  open,
  onClose,
  onSubmit,
  isLoading,
}: StoreFormProps) {
  const isEditMode = !!store;

  const [formData, setFormData] = useState({
    vendorId: '',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when store changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        vendorId: store?.vendorId || '',
        name: store?.name || '',
        address: store?.address || '',
        city: store?.city || '',
        state: store?.state || '',
        pincode: store?.pincode || '',
        phone: store?.phone || '',
      });
      setErrors({});
    }
  }, [store, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }

    // Only validate vendorId for new stores (not when editing)
    if (!isEditMode && !formData.vendorId.trim()) {
      newErrors.vendorId = 'Vendor ID is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      // Don't include vendorId when editing
      const submitData: Partial<Store> = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone || undefined,
      };

      // Only include vendorId for new stores
      if (!isEditMode) {
        submitData.vendorId = formData.vendorId;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      vendorId: '',
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Store' : 'Add New Store'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* Vendor ID - Editable only when creating, read-only when editing */}
            <div className="space-y-2">
              <Label htmlFor="vendorId">
                Vendor ID {!isEditMode && '*'}
              </Label>
              {isEditMode ? (
                // Read-only display for edit mode
                <div className="flex items-center gap-2">
                  <Input
                    id="vendorId"
                    value={formData.vendorId}
                    disabled
                    className="bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>
              ) : (
                // Editable input for create mode
                <>
                  <Input
                    id="vendorId"
                    value={formData.vendorId}
                    onChange={(e) => handleChange('vendorId', e.target.value)}
                    placeholder="Enter vendor ID (e.g., vendor_123)"
                    className={errors.vendorId ? 'border-red-500' : ''}
                  />
                  {errors.vendorId && (
                    <p className="text-sm text-red-500">{errors.vendorId}</p>
                  )}
                </>
              )}
            </div>

            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Store Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter store name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Enter street address"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter city"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="Enter state"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Pincode and Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  placeholder="Enter pincode"
                  className={errors.pincode ? 'border-red-500' : ''}
                />
                {errors.pincode && (
                  <p className="text-sm text-red-500">{errors.pincode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : isEditMode
                  ? 'Update Store'
                  : 'Add Store'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}