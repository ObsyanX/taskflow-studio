import React, { memo } from 'react';
import { Repeat } from 'lucide-react';
import { RecurrenceType } from '@/types/task';
import { cn } from '@/lib/utils';

interface RecurrenceSelectorProps {
  value: RecurrenceType;
  onChange: (value: RecurrenceType) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

const recurrenceOptions: { value: RecurrenceType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const getRecurrenceLabel = (recurrence: RecurrenceType): string => {
  switch (recurrence) {
    case 'daily':
      return 'Repeats daily';
    case 'weekly':
      return 'Repeats weekly';
    case 'monthly':
      return 'Repeats monthly';
    default:
      return '';
  }
};

export const RecurrenceSelector = memo(function RecurrenceSelector({
  value,
  onChange,
  disabled = false,
  showLabel = true,
}: RecurrenceSelectorProps) {
  return (
    <div>
      {showLabel && (
        <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Repeat className="w-4 h-4" />
          Repeat
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {recurrenceOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={cn(
              'px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all',
              disabled && 'opacity-50 cursor-not-allowed',
              value === option.value
                ? 'bg-primary/10 text-primary ring-2 ring-primary/30'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            )}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
});
