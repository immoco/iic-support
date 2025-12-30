import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: number;
  className?: string;
}

const priorityStyles: Record<number, string> = {
  1: 'bg-muted text-muted-foreground',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-amber-100 text-amber-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700',
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
        priorityStyles[priority] || priorityStyles[1],
        className
      )}
    >
      {priority}
    </span>
  );
}
