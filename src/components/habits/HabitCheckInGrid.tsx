import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Flame,
  Target,
  Plus,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getWeek, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Habit, HabitLog } from '@/types/habits';

interface HabitCheckInGridProps {
  habits: Habit[];
  logs: HabitLog[];
  onToggleLog: (habitId: string, date: Date, value?: number) => void;
  onUpdateLogValue: (habitId: string, date: Date, value: number) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onAddHabit: () => void;
}

export function HabitCheckInGrid({
  habits,
  logs,
  onToggleLog,
  onUpdateLogValue,
  onEditHabit,
  onDeleteHabit,
  onAddHabit,
}: HabitCheckInGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group days by week
  const weeks = useMemo(() => {
    const weekMap = new Map<number, Date[]>();
    days.forEach(day => {
      const weekNum = getWeek(day);
      if (!weekMap.has(weekNum)) {
        weekMap.set(weekNum, []);
      }
      weekMap.get(weekNum)!.push(day);
    });
    return Array.from(weekMap.entries()).map(([weekNum, weekDays]) => ({
      weekNum,
      days: weekDays,
    }));
  }, [days]);

  const getLogForHabitAndDate = (habitId: string, date: Date): HabitLog | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return logs.find(l => l.habit_id === habitId && l.log_date === dateStr);
  };

  const getCompletionStatus = (habitId: string, date: Date) => {
    const log = getLogForHabitAndDate(habitId, date);
    const habit = habits.find(h => h.id === habitId);
    
    if (!log) return 'empty';
    if (!habit) return 'empty';
    
    if (habit.target_type === 'yes_no') {
      return log.completed ? 'completed' : 'missed';
    }
    
    // For count/duration types
    const value = log.value || 0;
    const target = habit.target_value || 1;
    
    if (value >= target) return 'completed';
    if (value > 0) return 'partial';
    return 'missed';
  };

  const getCellColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/80 hover:bg-green-500';
      case 'partial': return 'bg-yellow-500/80 hover:bg-yellow-500';
      case 'missed': return 'bg-red-500/80 hover:bg-red-500';
      default: return 'bg-muted/50 hover:bg-muted';
    }
  };

  const calculateHabitStats = (habitId: string) => {
    const habitLogs = logs.filter(l => l.habit_id === habitId);
    const completed = habitLogs.filter(l => l.completed).length;
    const total = days.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const calculateTotalStats = () => {
    const totalPossible = habits.length * days.length;
    let totalCompleted = 0;
    let totalMissed = 0;

    habits.forEach(habit => {
      days.forEach(day => {
        const status = getCompletionStatus(habit.id, day);
        if (status === 'completed') totalCompleted++;
        else if (status === 'missed') totalMissed++;
      });
    });

    const percentage = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    return { totalCompleted, totalMissed, totalPossible, percentage };
  };

  const totalStats = calculateTotalStats();

  return (
    <TooltipProvider>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          
          <Button onClick={onAddHabit} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Habit
          </Button>
        </div>

        {/* Grid Container */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Week Headers */}
            <thead>
              <tr className="bg-muted/30">
                <th className="sticky left-0 bg-muted/30 z-10 px-4 py-3 text-left text-sm font-medium text-muted-foreground min-w-[200px]">
                  Habit
                </th>
                <th className="px-2 py-3 text-center text-sm font-medium text-muted-foreground min-w-[60px]">
                  Streak
                </th>
                <th className="px-2 py-3 text-center text-sm font-medium text-muted-foreground min-w-[80px]">
                  Progress
                </th>
                {weeks.map(({ weekNum, days: weekDays }) => (
                  <th
                    key={weekNum}
                    colSpan={weekDays.length}
                    className="px-1 py-2 text-center text-xs font-medium text-muted-foreground border-l border-border/30"
                  >
                    Week {weekNum}
                  </th>
                ))}
              </tr>
              <tr className="bg-muted/20">
                <th className="sticky left-0 bg-muted/20 z-10"></th>
                <th></th>
                <th></th>
                {days.map(day => (
                  <th
                    key={day.toISOString()}
                    className={cn(
                      "px-0.5 py-1 text-center text-xs font-normal",
                      isSameDay(day, new Date()) && "bg-primary/10"
                    )}
                  >
                    <div className="text-muted-foreground">{format(day, 'EEE')}</div>
                    <div className={cn(
                      "font-medium",
                      isSameDay(day, new Date()) && "text-primary"
                    )}>
                      {format(day, 'd')}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {habits.map((habit, index) => {
                const stats = calculateHabitStats(habit.id);
                const streak = habit.streak?.current_streak || 0;

                return (
                  <motion.tr
                    key={habit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-border/30 hover:bg-muted/10"
                  >
                    {/* Habit Name */}
                    <td className="sticky left-0 bg-card z-10 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: habit.category?.color || '#6366f1' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {habit.title}
                          </p>
                          {habit.target_type !== 'yes_no' && (
                            <p className="text-xs text-muted-foreground">
                              Target: {habit.target_value} {habit.target_unit || 'times'}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditHabit(habit)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeleteHabit(habit.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>

                    {/* Streak */}
                    <td className="px-2 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className={cn(
                          "w-4 h-4",
                          streak > 0 ? "text-orange-500" : "text-muted-foreground"
                        )} />
                        <span className={cn(
                          "text-sm font-medium",
                          streak > 0 ? "text-orange-500" : "text-muted-foreground"
                        )}>
                          {streak}
                        </span>
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={stats.percentage} className="h-2 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground w-10 text-right">
                          {stats.percentage}%
                        </span>
                      </div>
                    </td>

                    {/* Day Cells */}
                    {days.map(day => {
                      const status = getCompletionStatus(habit.id, day);
                      const log = getLogForHabitAndDate(habit.id, day);
                      const isToday = isSameDay(day, new Date());

                      return (
                        <td key={day.toISOString()} className="px-0.5 py-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => onToggleLog(habit.id, day)}
                                className={cn(
                                  "w-7 h-7 rounded-md flex items-center justify-center transition-all",
                                  getCellColor(status),
                                  isToday && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                                )}
                              >
                                {status === 'completed' && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                                {status === 'partial' && (
                                  <span className="text-xs text-white font-medium">
                                    {log?.value}
                                  </span>
                                )}
                                {status === 'missed' && (
                                  <X className="w-3 h-3 text-white" />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{format(day, 'MMM d, yyyy')}</p>
                              {log?.notes && <p className="text-xs">{log.notes}</p>}
                            </TooltipContent>
                          </Tooltip>
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })}

              {/* Summary Row */}
              {habits.length > 0 && (
                <tr className="border-t-2 border-border bg-muted/20">
                  <td className="sticky left-0 bg-muted/20 z-10 px-4 py-3 font-semibold">
                    Summary
                  </td>
                  <td></td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={totalStats.percentage} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-10 text-right">
                        {totalStats.percentage}%
                      </span>
                    </div>
                  </td>
                  {days.map(day => {
                    let completed = 0;
                    habits.forEach(habit => {
                      if (getCompletionStatus(habit.id, day) === 'completed') completed++;
                    });
                    const percentage = habits.length > 0 
                      ? Math.round((completed / habits.length) * 100) 
                      : 0;

                    return (
                      <td key={day.toISOString()} className="px-0.5 py-2 text-center">
                        <div className={cn(
                          "w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium mx-auto",
                          percentage === 100 ? "bg-green-500/80 text-white" :
                          percentage >= 50 ? "bg-yellow-500/80 text-white" :
                          percentage > 0 ? "bg-orange-500/80 text-white" :
                          "bg-muted/50 text-muted-foreground"
                        )}>
                          {completed}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {habits.length === 0 && (
          <div className="p-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building better habits by adding your first one
            </p>
            <Button onClick={onAddHabit}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Habit
            </Button>
          </div>
        )}

        {/* Legend */}
        {habits.length > 0 && (
          <div className="p-4 border-t border-border/50 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500" />
              <span className="text-muted-foreground">Partial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-muted-foreground">Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-muted-foreground">Not tracked</span>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
