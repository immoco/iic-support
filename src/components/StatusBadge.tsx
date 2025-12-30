import { cn } from '@/lib/utils';
import { RequestStatus } from '@/types/database';
import { REQUEST_STATUSES } from '@/lib/constants';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const statusStyles: Record<RequestStatus, string> = {
  open: 'bg-status-open/15 text-blue-700 border-status-open/30',
  under_review: 'bg-status-review/15 text-amber-700 border-status-review/30',
  approved: 'bg-status-approved/15 text-green-700 border-status-approved/30',
  rejected: 'bg-status-rejected/15 text-red-700 border-status-rejected/30',
  resolved: 'bg-status-resolved/15 text-emerald-700 border-status-resolved/30',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        statusStyles[status],
        className
      )}
    >
      {REQUEST_STATUSES[status]}
    </span>
  );
}
