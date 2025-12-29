import React, { memo } from 'react';
import { Tag } from 'lucide-react';
import { TaskCategory, DEFAULT_CATEGORIES } from '@/types/task';
import { CategoryBadge } from './CategoryBadge';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  selectedCategoryId?: string;
  onSelect: (categoryId: string | undefined) => void;
  showLabel?: boolean;
}

export const CategorySelector = memo(function CategorySelector({
  selectedCategoryId,
  onSelect,
  showLabel = true,
}: CategorySelectorProps) {
  return (
    <div>
      {showLabel && (
        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Tag className="w-4 h-4" />
          Category
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
            !selectedCategoryId
              ? 'bg-muted text-foreground ring-2 ring-muted-foreground/30'
              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
          )}
        >
          None
        </button>
        {DEFAULT_CATEGORIES.map((category) => (
          <CategoryBadge
            key={category.id}
            category={category}
            onClick={() => onSelect(category.id)}
            selected={selectedCategoryId === category.id}
          />
        ))}
      </div>
    </div>
  );
});
