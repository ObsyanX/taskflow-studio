import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SortAsc, Check } from 'lucide-react';
import { FilterType, SortType } from '@/types/task';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const sortOptions: { value: SortType; label: string }[] = [
  { value: 'date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export const FilterBar = memo(function FilterBar({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  searchInputRef,
  stats,
}: FilterBarProps) {
  const [showSortMenu, setShowSortMenu] = React.useState(false);

  const getCount = useCallback((f: FilterType) => {
    switch (f) {
      case 'all': return stats.total;
      case 'active': return stats.active;
      case 'completed': return stats.completed;
    }
  }, [stats]);

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks... (press /)"
          className="input-modern pl-12 pr-4"
          aria-label="Search tasks"
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className={cn(
                'filter-tab relative',
                filter === value && 'active'
              )}
              aria-pressed={filter === value}
            >
              {filter === value && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={cn('relative z-10', filter === value && 'text-primary-foreground')}>
                {label}
              </span>
              <span
                className={cn(
                  'relative z-10 ml-1.5 px-1.5 py-0.5 rounded text-xs',
                  filter === value
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted-foreground/10 text-muted-foreground'
                )}
              >
                {getCount(value)}
              </span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-haspopup="listbox"
            aria-expanded={showSortMenu}
          >
            <SortAsc className="w-4 h-4" />
            Sort: {sortOptions.find(s => s.value === sortBy)?.label}
          </button>

          {showSortMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSortMenu(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute right-0 top-full mt-1 z-20 min-w-[160px] p-1 rounded-xl bg-card border border-border shadow-xl"
                role="listbox"
              >
                {sortOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      onSortChange(value);
                      setShowSortMenu(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                      sortBy === value
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-muted'
                    )}
                    role="option"
                    aria-selected={sortBy === value}
                  >
                    {label}
                    {sortBy === value && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
