import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const AnimatedCheckbox = memo(function AnimatedCheckbox({
  checked,
  onChange,
  disabled = false,
  className,
  'aria-label': ariaLabel = 'Toggle task completion',
}: AnimatedCheckboxProps) {
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        'relative flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        checked
          ? 'border-success bg-success'
          : 'border-border bg-card hover:border-primary/50',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      whileTap={{ scale: 0.9 }}
      style={{
        boxShadow: checked ? 'var(--shadow-success-glow)' : undefined,
      }}
    >
      <AnimatePresence mode="wait">
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          >
            <Check className="h-4 w-4 text-success-foreground" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
});
