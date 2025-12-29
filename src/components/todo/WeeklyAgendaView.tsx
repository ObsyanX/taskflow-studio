import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  Plus,
  Clock
} from 'lucide-react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  addWeeks,
  subWeeks,
  parseISO
} from 'date-fns';
import { Task, DEFAULT_CATEGORIES } from '@/types/task';
import { PriorityChip } from './PriorityChip';
import { CategoryBadge } from './CategoryBadge';
import { cn } from '@/lib/utils';

interface WeeklyAgendaViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (date: Date) => void;
}

export const WeeklyAgendaView = memo(function WeeklyAgendaView({
  tasks,
  onTaskClick,
  onAddTask,
}: WeeklyAgendaViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  // Get all days of the current week
  const weekDays = useMemo(() => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
  }, [currentWeekStart]);

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
    
    // Sort tasks by time within each day
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) => {
        if (!a.due || !b.due) return 0;
        return new Date(a.due).getTime() - new Date(b.due).getTime();
      });
    });
    
    return grouped;
  }, [tasks]);

  const handlePrevWeek = useCallback(() => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  }, []);

  const handleTodayClick = useCallback(() => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
  }, []);

  const getWeekRange = () => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 });
    const startMonth = format(currentWeekStart, 'MMM d');
    const endMonth = format(weekEnd, 'MMM d, yyyy');
    return `${startMonth} - ${endMonth}`;
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Weekly Agenda
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTodayClick}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              This Week
            </button>
            <button
              onClick={handlePrevWeek}
              className="btn-ghost p-2"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextWeek}
              className="btn-ghost p-2"
              aria-label="Next week"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{getWeekRange()}</p>
      </div>

      {/* Week days */}
      <div className="divide-y divide-border">
        {weekDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate[dateKey] || [];
          const dayIsToday = isToday(day);

          return (
            <div 
              key={dateKey}
              className={cn(
                'p-4 transition-colors',
                dayIsToday && 'bg-primary/5'
              )}
            >
              {/* Day header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex flex-col items-center justify-center w-12 h-12 rounded-xl',
                    dayIsToday 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  )}>
                    <span className="text-xs font-medium uppercase">
                      {format(day, 'EEE')}
                    </span>
                    <span className="text-lg font-bold">
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div>
                    <p className={cn(
                      'font-medium',
                      dayIsToday ? 'text-primary' : 'text-foreground'
                    )}>
                      {dayIsToday ? 'Today' : format(day, 'EEEE')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onAddTask(day)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {/* Tasks for the day */}
              {dayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground/60 italic pl-15">
                  No tasks scheduled
                </p>
              ) : (
                <div className="space-y-2 pl-15">
                  {dayTasks.map((task, index) => {
                    const category = task.categoryId 
                      ? DEFAULT_CATEGORIES.find(c => c.id === task.categoryId)
                      : null;

                    return (
                      <motion.button
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        className={cn(
                          'w-full text-left p-3 rounded-xl bg-background border border-border/50 hover:border-border hover:shadow-md transition-all',
                          task.done && 'opacity-60'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {task.due && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {format(parseISO(task.due), 'h:mm a')}
                                </div>
                              )}
                              {category && (
                                <CategoryBadge category={category} size="sm" />
                              )}
                            </div>
                            <p className={cn(
                              'text-sm font-medium text-foreground',
                              task.done && 'line-through text-muted-foreground'
                            )}>
                              {task.title}
                            </p>
                            {task.desc && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {task.desc}
                              </p>
                            )}
                          </div>
                          <PriorityChip priority={task.priority} />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
