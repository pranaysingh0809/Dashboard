import { cn } from '@/lib/utils';
import { OrderStatus, PickupStatus, EdgeCaseStatus } from '@/types';

type StatusType = OrderStatus | PickupStatus | EdgeCaseStatus | 'active' | 'inactive';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // Order statuses
  created: { label: 'Created', className: 'bg-status-info-bg text-status-info' },
  pending_approval: { label: 'Pending Approval', className: 'bg-status-warning-bg text-status-warning' },
  approved: { label: 'Approved', className: 'bg-status-success-bg text-status-success' },
  assigned: { label: 'Assigned', className: 'bg-status-pending-bg text-status-pending' },
  pickup_scheduled: { label: 'Pickup Scheduled', className: 'bg-status-info-bg text-status-info' },
  picked_up: { label: 'Picked Up', className: 'bg-status-info-bg text-status-info' },
  in_transit: { label: 'In Transit', className: 'bg-status-info-bg text-status-info' },
  delivered: { label: 'Delivered', className: 'bg-status-success-bg text-status-success' },
  verified: { label: 'Verified', className: 'bg-status-success-bg text-status-success' },
  completed: { label: 'Completed', className: 'bg-status-success-bg text-status-success' },
  rejected: { label: 'Rejected', className: 'bg-status-error-bg text-status-error' },
  cancelled: { label: 'Cancelled', className: 'bg-status-error-bg text-status-error' },
  
  // Pickup statuses
  scheduled: { label: 'Scheduled', className: 'bg-status-info-bg text-status-info' },
  arrived: { label: 'Arrived', className: 'bg-status-info-bg text-status-info' },
  collected: { label: 'Collected', className: 'bg-status-success-bg text-status-success' },
  failed: { label: 'Failed', className: 'bg-status-error-bg text-status-error' },
  rescheduled: { label: 'Rescheduled', className: 'bg-status-warning-bg text-status-warning' },
  
  // Edge case statuses
  pending: { label: 'Pending', className: 'bg-status-warning-bg text-status-warning' },
  escalated: { label: 'Escalated', className: 'bg-status-error-bg text-status-error' },
  
  // General statuses
  active: { label: 'Active', className: 'bg-status-success-bg text-status-success' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
