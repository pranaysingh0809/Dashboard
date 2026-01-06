import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { mockEdgeCases } from '@/data/mockData';
import { EdgeCase, EdgeCaseType } from '@/types';

const typeLabels: Record<EdgeCaseType, string> = {
  condition_dispute: 'Condition Dispute',
  pricing_adjustment: 'Pricing Adjustment',
  pickup_failure: 'Pickup Failure',
  customer_complaint: 'Customer Complaint',
  other: 'Other',
};

export default function EdgeCases() {
  const columns: Column<EdgeCase>[] = [
    { key: 'order', header: 'Order #', cell: (e) => <span className="font-medium">{e.orderNumber}</span> },
    { key: 'type', header: 'Type', cell: (e) => <Badge variant="outline">{typeLabels[e.type]}</Badge> },
    { key: 'title', header: 'Title', cell: (e) => e.title },
    { key: 'expected', header: 'Expected', cell: (e) => e.expectedValue },
    { key: 'actual', header: 'Actual', cell: (e) => e.actualValue },
    { key: 'status', header: 'Status', cell: (e) => <StatusBadge status={e.status} /> },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Edge Cases" description="Review and resolve exceptions" />
      <DataTable columns={columns} data={mockEdgeCases} keyExtractor={(e) => e.id} />
    </DashboardLayout>
  );
}
