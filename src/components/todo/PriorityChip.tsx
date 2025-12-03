import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Priority } from '@/types/task';

interface PriorityChipProps {
  priority: Priority;
  size?: 'sm' | 'md';
  className?: string;
}

export const PriorityChip = memo(function PriorityChip({
  priority,
  size = 'sm',
  className,
}: PriorityChipProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const priorityClasses = {
    High: 'bg-destructive/10 text-destructive',
    Medium: 'bg-warning/10 text-warning',
    Low: 'bg-muted text-muted-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        sizeClasses[size],
        priorityClasses[priority],
        className
      )}
    >
      {priority}
    </span>
  );
});
