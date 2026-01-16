import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, eachDayOfInterval, startOfYear, endOfYear, getDay, subYears, addDays, startOfWeek, differenceInWeeks } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { HabitLog } from '@/types/habits';

interface HabitHeatmapProps {
  logs: HabitLog[];
  year?: number;
  totalHabits: number;
}

export function HabitHeatmap({ logs, year = new Date().getFullYear(), totalHabits }: HabitHeatmapProps) {
  const startDate = startOfYear(new Date(year, 0, 1));
  const endDate = endOfYear(new Date(year, 0, 1));
  
  // Calculate completion data for each day
  const dayData = useMemo(() => {
    const data = new Map<string, { completed: number; total: number; percentage: number }>();
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    days.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayLogs = logs.filter(l => l.log_date === dateStr);
      const completed = dayLogs.filter(l => l.completed).length;
      
      data.set(dateStr, {
        completed,
        total: totalHabits,
        percentage: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0,
      });
    });
    
    return data;
  }, [logs, startDate, endDate, totalHabits]);

  // Generate weeks array
  const weeks = useMemo(() => {
    const weeksArray: Date[][] = [];
    let currentDate = startOfWeek(startDate);
    
    while (currentDate <= endDate) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        const day = addDays(currentDate, i);
        if (day >= startDate && day <= endDate) {
          week.push(day);
        } else {
          week.push(null as any); // Placeholder for empty cells
        }
      }
      weeksArray.push(week);
      currentDate = addDays(currentDate, 7);
    }
    
    return weeksArray;
  }, [startDate, endDate]);

  const getColor = (percentage: number) => {
    if (percentage === 0) return 'bg-muted';
    if (percentage < 25) return 'bg-green-200 dark:bg-green-900';
    if (percentage < 50) return 'bg-green-300 dark:bg-green-700';
    if (percentage < 75) return 'bg-green-400 dark:bg-green-600';
    return 'bg-green-500 dark:bg-green-500';
  };

  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstValidDay = week.find(d => d);
      if (firstValidDay) {
        const month = firstValidDay.getMonth();
        if (month !== lastMonth) {
          labels.push({
            month: format(firstValidDay, 'MMM'),
            weekIndex,
          });
          lastMonth = month;
        }
      }
    });
    
    return labels;
  }, [weeks]);

  return (
    <TooltipProvider>
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <h3 className="text-lg font-semibold mb-4">Habit Heatmap - {year}</h3>
        
        <div className="overflow-x-auto">
          {/* Month labels */}
          <div className="flex mb-2 pl-8">
            {monthLabels.map(({ month, weekIndex }) => (
              <div
                key={`${month}-${weekIndex}`}
                className="text-xs text-muted-foreground"
                style={{
                  position: 'relative',
                  left: `${weekIndex * 14}px`,
                  width: '28px',
                }}
              >
                {month}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col justify-between pr-2 text-xs text-muted-foreground h-[98px]">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-0.5">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5">
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={dayIndex} className="w-3 h-3" />;
                    }

                    const dateStr = format(day, 'yyyy-MM-dd');
                    const data = dayData.get(dateStr);
                    const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');

                    return (
                      <Tooltip key={dayIndex}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: weekIndex * 0.005 }}
                            className={cn(
                              "w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125",
                              getColor(data?.percentage || 0),
                              isToday && "ring-1 ring-primary"
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <p className="font-medium">{format(day, 'MMM d, yyyy')}</p>
                            <p className="text-sm text-muted-foreground">
                              {data?.completed || 0} / {data?.total || 0} habits ({data?.percentage || 0}%)
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
          </div>
          <span>More</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
