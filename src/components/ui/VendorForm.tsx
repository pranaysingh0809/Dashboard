// src/components/ui/VendorForm.tsx

import { useState, useEffect } from 'react';
import { Vendor } from '@/types';
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

interface VendorFormProps {
  vendor?: Vendor | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Vendor>) => Promise<void>;
  isLoading?: boolean;
}

export function VendorForm({
  vendor,
  open,
  onClose,
  onSubmit,
  isLoading,
}: VendorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    gradingSystem: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when vendor changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: vendor?.name || '',
        contactEmail: vendor?.contactEmail || '',
        contactPhone: vendor?.contactPhone || '',
        gradingSystem: vendor?.gradingSystem?.toString() || '',
      });
      setErrors({});
    }
  }, [vendor, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vendor name is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
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
      const submitData: Partial<Vendor> = {
        name: formData.name,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || undefined,
        gradingSystem: formData.gradingSystem ? parseInt(formData.gradingSystem, 10) : undefined,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      contactEmail: '',
      contactPhone: '',
      gradingSystem: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {vendor ? 'Edit Vendor' : 'Add New Vendor'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* Vendor Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter vendor name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="email@example.com"
                className={errors.contactEmail ? 'border-red-500' : ''}
              />
              {errors.contactEmail && (
                <p className="text-sm text-red-500">{errors.contactEmail}</p>
              )}
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            {/* Grading System */}
            <div className="space-y-2">
              <Label htmlFor="gradingSystem">Grading System</Label>
              <Input
                id="gradingSystem"
                type="number"
                value={formData.gradingSystem}
                onChange={(e) => handleChange('gradingSystem', e.target.value)}
                placeholder="Enter grading system (e.g., 13)"
              />
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
                : vendor
                  ? 'Update Vendor'
                  : 'Add Vendor'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}