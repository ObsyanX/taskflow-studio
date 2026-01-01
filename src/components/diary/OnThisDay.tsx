import React, { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, X } from 'lucide-react';
import { format, parseISO, subYears, getMonth, getDate } from 'date-fns';
import { cn } from '@/lib/utils';
import { DiaryEntry, MOOD_EMOJI } from '@/types/diary';

interface OnThisDayProps {
  currentDate: string;
  entries: DiaryEntry[];
  onNavigateToEntry: (date: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const OnThisDay = memo(function OnThisDay({
  currentDate,
  entries,
  onNavigateToEntry,
  isOpen,
  onClose,
}: OnThisDayProps) {
  const current = parseISO(currentDate);
  const currentMonth = getMonth(current);
  const currentDay = getDate(current);

  // Find all entries from previous years on this day
  const memoriesOnThisDay = useMemo(() => {
    return entries
      .filter((entry) => {
        const entryDate = parseISO(entry.date);
        return (
          getMonth(entryDate) === currentMonth &&
          getDate(entryDate) === currentDay &&
          entry.date !== currentDate &&
          entry.content.trim().length > 0
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // Most recent first
  }, [entries, currentMonth, currentDay, currentDate]);

  if (memoriesOnThisDay.length === 0) {
    return null;
  }

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            'mb-4 rounded-xl overflow-hidden',
            'bg-gradient-to-br from-primary/10 to-primary/5',
            'border border-primary/20'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">On This Day</span>
              <span className="text-sm text-muted-foreground">
                ({memoriesOnThisDay.length} {memoriesOnThisDay.length === 1 ? 'memory' : 'memories'})
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>

          {/* Memories list */}
          <div className="max-h-64 overflow-y-auto">
            {memoriesOnThisDay.map((entry) => {
              const entryDate = parseISO(entry.date);
              const yearsAgo = Math.floor(
                (current.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
              );
              const preview = stripHtml(entry.content).slice(0, 100);

              return (
                <motion.button
                  key={entry.id}
                  whileHover={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                  onClick={() => onNavigateToEntry(entry.date)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-primary/5 last:border-b-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {format(entryDate, 'yyyy')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {yearsAgo} {yearsAgo === 1 ? 'year' : 'years'} ago
                      </span>
                      {entry.mood && (
                        <span className="text-sm">{MOOD_EMOJI[entry.mood]}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {preview}
                      {entry.content.length > 100 && '...'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
