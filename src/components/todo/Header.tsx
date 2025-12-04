import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sun, Moon, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export const Header = memo(function Header({
  theme,
  onToggleTheme,
  stats,
}: HeaderProps) {
  const completionPercent = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">TaskFlow</h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden xs:block">Stay organized, get things done</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Keyboard shortcuts hint */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-xs">
            <Keyboard className="w-3.5 h-3.5" />
            <span>N</span>
            <span className="opacity-50">new</span>
            <span className="ml-1">/</span>
            <span className="opacity-50">search</span>
          </div>

          {/* Theme Toggle */}
          <motion.button
            onClick={onToggleTheme}
            className={cn(
              'relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center',
              'bg-muted hover:bg-muted/80 transition-colors'
            )}
            whileTap={{ scale: 0.9 }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {stats.active} task{stats.active !== 1 ? 's' : ''} remaining
          </span>
          <span className="font-medium text-foreground">{completionPercent}% complete</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </div>
    </header>
  );
});
