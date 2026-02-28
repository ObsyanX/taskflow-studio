import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from '@/components/ui/checkbox';
 
 import { 
    Check, 
    X, 
    Flame,
    MoreVertical,
    Edit,
    Trash2,
    GripVertical,
    Archive,
    ArchiveRestore
  } from 'lucide-react';
 import { format, isSameDay } from 'date-fns';
 import { Button } from '@/components/ui/button';
 import { Progress } from '@/components/ui/progress';
 import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
 import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
 import { cn } from '@/lib/utils';
 import { Habit, HabitLog } from '@/types/habits';
 
interface DraggableHabitRowProps {
  habit: Habit;
  days: Date[];
  logs: HabitLog[];
  stats: { completed: number; total: number; percentage: number };
  onToggleLog: (habitId: string, date: Date) => void;
   onEditHabit: (habit: Habit) => void;
   onDeleteHabit: (habitId: string) => void;
   onArchiveHabit?: (habitId: string, archive: boolean) => void;
  getCompletionStatus: (habitId: string, date: Date) => string;
  getCellColor: (status: string) => string;
  isSelected?: boolean;
  onToggleSelect?: (habitId: string) => void;
  selectionMode?: boolean;
}
 
export function DraggableHabitRow({
  habit,
  days,
  logs,
  stats,
   onToggleLog,
   onEditHabit,
   onDeleteHabit,
   onArchiveHabit,
  getCompletionStatus,
  getCellColor,
  isSelected = false,
  onToggleSelect,
  selectionMode = false,
}: DraggableHabitRowProps) {
   const {
     attributes,
     listeners,
     setNodeRef,
     transform,
     transition,
     isDragging,
   } = useSortable({ id: habit.id });
 
   const style = {
     transform: CSS.Transform.toString(transform),
     transition,
     opacity: isDragging ? 0.5 : 1,
   };
 
   const streak = habit.streak?.current_streak || 0;
 
   const getLogForHabitAndDate = (habitId: string, date: Date): HabitLog | undefined => {
     const dateStr = format(date, 'yyyy-MM-dd');
     return logs.find(l => l.habit_id === habitId && l.log_date === dateStr);
   };
 
   return (
     <tr
       ref={setNodeRef}
       style={style}
       className={cn(
         "border-t border-border/30 hover:bg-muted/10",
         isDragging && "bg-muted/30"
       )}
     >
       {/* Drag Handle + Habit Name */}
        <td className="sticky left-0 bg-card z-10 px-4 py-3">
          <div className="flex items-center gap-2">
            {selectionMode && onToggleSelect && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(habit.id)}
                className="mr-1"
              />
            )}
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 text-muted-foreground"
            >
              <GripVertical className="w-4 h-4" />
            </button>
           <div
             className="w-3 h-3 rounded-full shrink-0"
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
                {onArchiveHabit && (
                  <DropdownMenuItem onClick={() => onArchiveHabit(habit.id, !habit.is_archived)}>
                    {habit.is_archived ? (
                      <><ArchiveRestore className="w-4 h-4 mr-2" /> Unarchive</>
                    ) : (
                      <><Archive className="w-4 h-4 mr-2" /> Archive</>
                    )}
                  </DropdownMenuItem>
                )}
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
     </tr>
   );
 }