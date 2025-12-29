import React, { memo } from 'react';
import { TaskCategory } from '@/types/task';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: TaskCategory;
  size?: 'sm' | 'md';
  onClick?: () => void;
  selected?: boolean;
}

export const CategoryBadge = memo(function CategoryBadge({
  category,
  size = 'md',
  onClick,
  selected = false,
}: CategoryBadgeProps) {
  const Component = onClick ? 'button' : 'span';
  
  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium transition-all',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        onClick && 'cursor-pointer hover:opacity-80',
        selected && 'ring-2 ring-offset-1 ring-offset-background'
      )}
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
        ...(selected && { ringColor: category.color }),
      }}
      type={onClick ? 'button' : undefined}
    >
      <span
        className={cn(
          'rounded-full',
          size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
        )}
        style={{ backgroundColor: category.color }}
      />
      {category.name}
    </Component>
  );
});
