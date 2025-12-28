import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Plus,
  Clock
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns';
import { Task } from '@/types/task';
import { PriorityChip } from './PriorityChip';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (date: Date) => void;
}

export const CalendarView = memo(function CalendarView({
  tasks,
  onTaskClick,
  onAddTask,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get all days to display in the calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      if (task.due) {
        const dateKey = format(parseISO(task.due), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    
    return grouped;
  }, [tasks]);

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return tasksByDate[dateKey] || [];
  }, [selectedDate, tasksByDate]);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(prev => prev && isSameDay(prev, date) ? null : date);
  }, []);

  const handleTodayClick = useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  }, []);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTodayClick}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="btn-ghost p-2"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="btn-ghost p-2"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div 
              key={day} 
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-2 sm:p-4">
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const dayIsToday = isToday(day);
            const hasOverdue = dayTasks.some(t => !t.done && new Date(t.due!) < new Date() && !isToday(new Date(t.due!)));
            const hasHighPriority = dayTasks.some(t => !t.done && t.priority === 'High');

            return (
              <motion.button
                key={dateKey}
                onClick={() => handleDateClick(day)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'relative aspect-square p-1 rounded-lg transition-all flex flex-col items-center justify-start',
                  'hover:bg-muted',
                  !isCurrentMonth && 'opacity-40',
                  isSelected && 'bg-primary/10 ring-2 ring-primary',
                  dayIsToday && !isSelected && 'bg-primary/5'
                )}
              >
                <span
                  className={cn(
                    'text-xs sm:text-sm font-medium',
                    dayIsToday && 'text-primary font-bold',
                    !dayIsToday && 'text-foreground'
                  )}
                >
                  {format(day, 'd')}
                </span>
                
                {/* Task indicators */}
                {dayTasks.length > 0 && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {dayTasks.slice(0, 3).map((task, i) => (
                      <div
                        key={task.id}
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          task.done 
                            ? 'bg-muted-foreground/50' 
                            : task.priority === 'High'
                            ? 'bg-destructive'
                            : task.priority === 'Medium'
                            ? 'bg-warning'
                            : 'bg-primary'
                        )}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <span className="text-[8px] text-muted-foreground">
                        +{dayTasks.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected date details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {isToday(selectedDate) 
                    ? 'Today' 
                    : format(selectedDate, 'EEEE, MMM d')}
                </h3>
                <button
                  onClick={() => onAddTask(selectedDate)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Task
                </button>
              </div>

              {selectedDateTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks scheduled for this day
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedDateTasks.map(task => (
                    <motion.button
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        'w-full text-left p-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors',
                        task.done && 'opacity-60'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            'text-sm font-medium text-foreground truncate',
                            task.done && 'line-through text-muted-foreground'
                          )}>
                            {task.title}
                          </p>
                          {task.due && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {format(parseISO(task.due), 'h:mm a')}
                            </div>
                          )}
                        </div>
                        <PriorityChip priority={task.priority} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
