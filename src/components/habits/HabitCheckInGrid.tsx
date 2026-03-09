 import React, { useState, useMemo, useCallback } from 'react';
 import {
   DndContext,
   closestCenter,
   KeyboardSensor,
   PointerSensor,
   useSensor,
   useSensors,
   DragEndEvent,
 } from '@dnd-kit/core';
 import {
   arrayMove,
   SortableContext,
   sortableKeyboardCoordinates,
   verticalListSortingStrategy,
 } from '@dnd-kit/sortable';
import { 
  ChevronLeft, 
  ChevronRight, 
  Target,
  Plus,
  Archive,
  Trash2,
  CheckSquare,
  XSquare
} from 'lucide-react';
 import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
 import { Progress } from '@/components/ui/progress';
 import { TooltipProvider } from '@/components/ui/tooltip';
 import { DraggableHabitRow } from './DraggableHabitRow';
import { cn } from '@/lib/utils';
import { Habit, HabitLog } from '@/types/habits';
import { BulkDeleteConfirmDialog } from './BulkDeleteConfirmDialog';

interface HabitCheckInGridProps {
  habits: Habit[];
  archivedHabits?: Habit[];
  logs: HabitLog[];
  onToggleLog: (habitId: string, date: Date, value?: number) => void;
  onUpdateLogValue: (habitId: string, date: Date, value: number) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onAddHabit: () => void;
  onReorderHabits?: (habitIds: string[]) => void;
  onArchiveHabit?: (habitId: string, archive: boolean) => void;
}

export function HabitCheckInGrid({
  habits,
  archivedHabits = [],
  logs,
  onToggleLog,
   onUpdateLogValue: _,
  onEditHabit,
  onDeleteHabit,
  onAddHabit,
   onReorderHabits,
   onArchiveHabit,
}: HabitCheckInGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showArchived, setShowArchived] = useState(false);
  const [selectedHabits, setSelectedHabits] = useState<Set<string>>(new Set());
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const selectionMode = selectedHabits.size > 0;

  const toggleSelect = useCallback((habitId: string) => {
    setSelectedHabits(prev => {
      const next = new Set(prev);
      if (next.has(habitId)) next.delete(habitId);
      else next.add(habitId);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedHabits(new Set(habits.map(h => h.id)));
  }, [habits]);

  const clearSelection = useCallback(() => {
    setSelectedHabits(new Set());
  }, []);

  const handleBulkArchive = useCallback(() => {
    if (!onArchiveHabit) return;
    selectedHabits.forEach(id => onArchiveHabit(id, true));
    setSelectedHabits(new Set());
  }, [selectedHabits, onArchiveHabit]);

  const handleBulkDelete = useCallback(() => {
    setShowBulkDeleteConfirm(true);
  }, []);

  const confirmBulkDelete = useCallback(() => {
    selectedHabits.forEach(id => onDeleteHabit(id));
    setSelectedHabits(new Set());
    setShowBulkDeleteConfirm(false);
  }, [selectedHabits, onDeleteHabit]);
 
   const sensors = useSensors(
     useSensor(PointerSensor),
     useSensor(KeyboardSensor, {
       coordinateGetter: sortableKeyboardCoordinates,
     })
   );

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

  const getCompletionStatus = (habitId: string, date: Date) => {
     const dateStr = format(date, 'yyyy-MM-dd');
     const log = logs.find(l => l.habit_id === habitId && l.log_date === dateStr);
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
     const habitLogs = logs.filter(l => l.habit_id === habitId && days.some(d => format(d, 'yyyy-MM-dd') === l.log_date));
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

   const handleDragEnd = useCallback((event: DragEndEvent) => {
     const { active, over } = event;
     
     if (over && active.id !== over.id && onReorderHabits) {
       const oldIndex = habits.findIndex(h => h.id === active.id);
       const newIndex = habits.findIndex(h => h.id === over.id);
       
       if (oldIndex !== -1 && newIndex !== -1) {
         const newOrder = arrayMove(habits, oldIndex, newIndex).map(h => h.id);
         onReorderHabits(newOrder);
       }
     }
   }, [habits, onReorderHabits]);
 
  return (
    <TooltipProvider>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
         <DndContext
           sensors={sensors}
           collisionDetection={closestCenter}
           onDragEnd={handleDragEnd}
         >
            {/* Bulk Action Bar */}
            {selectionMode && (
              <div className="p-3 border-b border-border/50 bg-primary/5 flex items-center gap-3 animate-in slide-in-from-top-2">
                <span className="text-sm font-medium text-foreground">
                  {selectedHabits.size} selected
                </span>
                <Button variant="outline" size="sm" onClick={selectAll} className="gap-1.5 text-xs">
                  <CheckSquare className="w-3.5 h-3.5" />
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection} className="gap-1.5 text-xs">
                  <XSquare className="w-3.5 h-3.5" />
                  Clear
                </Button>
                <div className="ml-auto flex items-center gap-2">
                  {onArchiveHabit && (
                    <Button variant="secondary" size="sm" onClick={handleBulkArchive} className="gap-1.5">
                      <Archive className="w-4 h-4" />
                      Archive ({selectedHabits.size})
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-1.5">
                    <Trash2 className="w-4 h-4" />
                    Delete ({selectedHabits.size})
                  </Button>
                </div>
              </div>
            )}

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
                 <SortableContext
                   items={habits.map(h => h.id)}
                   strategy={verticalListSortingStrategy}
                 >
                    {habits.map((habit) => {
                      const stats = calculateHabitStats(habit.id);
                      return (
                         <DraggableHabitRow
                           key={habit.id}
                           habit={habit}
                           days={days}
                           logs={logs}
                           stats={stats}
                           onToggleLog={onToggleLog}
                           onEditHabit={onEditHabit}
                           onDeleteHabit={onDeleteHabit}
                           onArchiveHabit={onArchiveHabit}
                           getCompletionStatus={getCompletionStatus}
                           getCellColor={getCellColor}
                           isSelected={selectedHabits.has(habit.id)}
                           onToggleSelect={toggleSelect}
                           selectionMode={selectionMode}
                         />
                       );
                     })}
                  </SortableContext>

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
         </DndContext>
          
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

        {/* Archived Habits Section */}
        {archivedHabits.length > 0 && (
          <div className="border-t border-border/50">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="w-full px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
            >
              <Archive className="w-4 h-4" />
              <span>{showArchived ? 'Hide' : 'Show'} Archived Habits ({archivedHabits.length})</span>
            </button>
            {showArchived && (
              <div className="px-4 pb-4 space-y-2">
                {archivedHabits.map(habit => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 opacity-70"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: habit.category?.color || '#6366f1' }}
                      />
                      <span className="font-medium text-foreground">{habit.title}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Archived</span>
                    </div>
                    {onArchiveHabit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onArchiveHabit(habit.id, false)}
                        className="text-xs gap-1"
                      >
                        Unarchive
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
