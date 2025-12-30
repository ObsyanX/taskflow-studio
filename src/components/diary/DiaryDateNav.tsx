import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { format, parseISO, addDays, subDays, isSameDay, subYears, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DiaryDateNavProps {
  currentDate: string;
  entryDates: string[];
  onDateChange: (date: string) => void;
}

export const DiaryDateNav = memo(function DiaryDateNav({
  currentDate,
  entryDates,
  onDateChange,
}: DiaryDateNavProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const current = parseISO(currentDate);
  const isCurrentToday = isToday(current);

  // Check for "On This Day" memories
  const getOnThisDayEntry = () => {
    const lastYear = subYears(current, 1);
    const lastYearDate = format(lastYear, 'yyyy-MM-dd');
    return entryDates.includes(lastYearDate) ? lastYearDate : null;
  };

  const onThisDayEntry = getOnThisDayEntry();

  const handlePrevDay = () => {
    onDateChange(format(subDays(current, 1), 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const nextDay = addDays(current, 1);
    if (!isToday(current)) {
      onDateChange(format(nextDay, 'yyyy-MM-dd'));
    }
  };

  const handleToday = () => {
    onDateChange(format(new Date(), 'yyyy-MM-dd'));
  };

  const hasEntryOnDate = (date: Date) => {
    return entryDates.includes(format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevDay}
          className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </motion.button>

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl transition-colors',
                'bg-card border border-border hover:bg-muted'
              )}
            >
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">
                {format(current, 'MMMM d, yyyy')}
              </span>
            </motion.button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={current}
              onSelect={(date) => {
                if (date) {
                  onDateChange(format(date, 'yyyy-MM-dd'));
                  setIsCalendarOpen(false);
                }
              }}
              disabled={(date) => date > new Date()}
              modifiers={{
                hasEntry: (date) => hasEntryOnDate(date),
              }}
              modifiersStyles={{
                hasEntry: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                },
              }}
            />
          </PopoverContent>
        </Popover>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNextDay}
          disabled={isCurrentToday}
          className={cn(
            'w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center transition-colors',
            isCurrentToday
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-muted'
          )}
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </motion.button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* On This Day indicator */}
        <AnimatePresence>
          {onThisDayEntry && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateChange(onThisDayEntry)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>On This Day</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Today button */}
        {!isCurrentToday && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
          >
            Today
          </motion.button>
        )}
      </div>
    </div>
  );
});
