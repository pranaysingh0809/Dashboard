// src/components/ui/UserForm.tsx

import { useState, useEffect } from 'react';
import { User, UserRole, UserSubRole, CreateUserPayload } from '@/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';

interface UserFormProps {
  user?: User | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserPayload | Partial<User>) => Promise<void>;
  isLoading?: boolean;
  vendors?: { id: string; name: string }[];
  stores?: { id: string; name: string; vendorId: string }[];
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'USER', label: 'User' },
  { value: 'MANAGER', label: 'Manager' },
];

const subRoleOptions: { value: UserSubRole; label: string }[] = [
  { value: null, label: 'None' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'PICKUP', label: 'Pickup' },
  { value: 'STORE_MANAGER', label: 'Store Manager' },
];

export function UserForm({
  user,
  open,
  onClose,
  onSubmit,
  isLoading,
  vendors = [],
  stores = [],
}: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'USER' as UserRole,
    subRole: null as UserSubRole,
    vendorId: '',
    storeId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const isEditMode = !!user;

  // Filter stores based on selected vendor
  const filteredStores = formData.vendorId 
    ? stores.filter(store => store.vendorId === formData.vendorId)
    : stores;

  // Reset form when user changes or dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '',
        role: user?.role || 'USER',
        subRole: user?.subRole || null,
        vendorId: user?.vendorId || '',
        storeId: user?.storeId || '',
      });
      setErrors({});
      setShowPassword(false);
    }
  }, [user, open]);

  const handleChange = (field: string, value: string | null) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Reset storeId if vendorId changes
      if (field === 'vendorId') {
        newData.storeId = '';
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    // Password is required only for new users
    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!isEditMode && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
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
      if (isEditMode) {
        // For edit mode, don't send password if empty
        const updateData: Partial<User> = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          subRole: formData.subRole,
          vendorId: formData.vendorId || undefined,
          storeId: formData.storeId || undefined,
        };
        await onSubmit(updateData);
      } else {
        // For create mode, include password
        const createData: CreateUserPayload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
          subRole: formData.subRole,
          vendorId: formData.vendorId || undefined,
          storeId: formData.storeId || undefined,
        };
        await onSubmit(createData);
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'USER',
      subRole: null,
      vendorId: '',
      storeId: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Edit User' : 'Create New User'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="user@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1234567890"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Password - only show for new users */}
            {!isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter password"
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            )}

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange('role', value)}
              >
                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Sub Role */}
            <div className="space-y-2">
              <Label htmlFor="subRole">Sub Role</Label>
              <Select
                value={formData.subRole || 'none'}
                onValueChange={(value) => handleChange('subRole', value === 'none' ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a sub role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {subRoleOptions.filter(opt => opt.value !== null).map((option) => (
                    <SelectItem key={option.value} value={option.value!}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vendor ID */}
            <div className="space-y-2">
              <Label htmlFor="vendorId">Vendor</Label>
              {vendors.length > 0 ? (
                <Select
                  value={formData.vendorId || 'none'}
                  onValueChange={(value) => handleChange('vendorId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="vendorId"
                  value={formData.vendorId}
                  onChange={(e) => handleChange('vendorId', e.target.value)}
                  placeholder="Enter vendor ID (optional)"
                />
              )}
            </div>

            {/* Store ID */}
            <div className="space-y-2">
              <Label htmlFor="storeId">Store</Label>
              {stores.length > 0 ? (
                <Select
                  value={formData.storeId || 'none'}
                  onValueChange={(value) => handleChange('storeId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {filteredStores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="storeId"
                  value={formData.storeId}
                  onChange={(e) => handleChange('storeId', e.target.value)}
                  placeholder="Enter store ID (optional)"
                />
              )}
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
                : user
                  ? 'Update User'
                  : 'Create User'
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}