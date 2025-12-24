import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/data/mockData';
import { Product } from '@/types';
import { Plus } from 'lucide-react';

export default function Products() {
  const columns: Column<Product>[] = [
    { key: 'brand', header: 'Brand', cell: (p) => <span className="font-medium">{p.brand}</span> },
    { key: 'model', header: 'Model', cell: (p) => p.model },
    { key: 'storage', header: 'Storage', cell: (p) => p.storage },
    { key: 'priceA', header: 'Grade A Price', cell: (p) => `₹${p.conditionGrades[0]?.price.toLocaleString() || '-'}` },
    { key: 'status', header: 'Status', cell: (p) => <StatusBadge status={p.status} /> },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Products" description="Manage phone catalog and pricing" actions={<Button><Plus className="h-4 w-4 mr-2" />Add Product</Button>} />
      <DataTable columns={columns} data={mockProducts} keyExtractor={(p) => p.id} />
    </DashboardLayout>
  );
}
