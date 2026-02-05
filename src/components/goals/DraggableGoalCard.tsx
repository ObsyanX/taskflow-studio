 import React from 'react';
 import { useSortable } from '@dnd-kit/sortable';
 import { CSS } from '@dnd-kit/utilities';
 
 import { 
   Calendar, 
   CheckCircle2, 
   ChevronDown,
   ChevronRight,
   Trash2,
   Edit2,
   Plus,
   GripVertical
 } from 'lucide-react';
 import { format, differenceInDays } from 'date-fns';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { Badge } from '@/components/ui/badge';
 import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
 } from '@/components/ui/collapsible';
 import { cn } from '@/lib/utils';
 import type { Goal, Milestone } from '@/types/habits';
 
 const priorityColors = {
   high: 'bg-red-500/10 text-red-500 border-red-500/20',
   medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
   low: 'bg-green-500/10 text-green-500 border-green-500/20',
 };
 
 const statusColors = {
   not_started: 'bg-muted text-muted-foreground',
   in_progress: 'bg-blue-500/10 text-blue-500',
   completed: 'bg-green-500/10 text-green-500',
   overdue: 'bg-red-500/10 text-red-500',
 };
 
 const statusLabels = {
   not_started: 'Not Started',
   in_progress: 'In Progress',
   completed: 'Completed',
   overdue: 'Overdue',
 };
 
 interface DraggableGoalCardProps {
   goal: Goal;
   milestones: Milestone[];
   isExpanded: boolean;
   onToggleExpand: () => void;
   onEdit: () => void;
   onDelete: () => void;
   onAddMilestone: () => void;
   onToggleMilestone: (milestone: Milestone) => void;
   onDeleteMilestone: (milestoneId: string) => void;
 }
 
 export function DraggableGoalCard({
   goal,
   milestones,
   isExpanded,
   onToggleExpand,
   onEdit,
   onDelete,
   onAddMilestone,
   onToggleMilestone,
   onDeleteMilestone,
 }: DraggableGoalCardProps) {
   const {
     attributes,
     listeners,
     setNodeRef,
     transform,
     transition,
     isDragging,
   } = useSortable({ id: goal.id });
 
   const style = {
     transform: CSS.Transform.toString(transform),
     transition,
     opacity: isDragging ? 0.5 : 1,
   };
 
   const calculateProgress = () => {
     if (milestones.length === 0) return 0;
     const completed = milestones.filter(m => m.status === 'completed').length;
     return Math.round((completed / milestones.length) * 100);
   };
 
   const getDaysRemaining = (deadline: string | null) => {
     if (!deadline) return null;
     return differenceInDays(new Date(deadline), new Date());
   };
 
   const progress = calculateProgress();
   const daysRemaining = getDaysRemaining(goal.deadline);
 
   return (
     <div ref={setNodeRef} style={style}>
       <Card className={cn("overflow-hidden", isDragging && "shadow-lg")}>
         <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
           <CardHeader className="pb-3">
             <div className="flex items-start justify-between gap-4">
               <div className="flex items-start gap-3 flex-1">
                 {/* Drag Handle */}
                 <button
                   {...attributes}
                   {...listeners}
                   className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 text-muted-foreground mt-0.5"
                 >
                   <GripVertical className="w-4 h-4" />
                 </button>
                 
                 <CollapsibleTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 mt-0.5">
                     {isExpanded ? (
                       <ChevronDown className="h-4 w-4" />
                     ) : (
                       <ChevronRight className="h-4 w-4" />
                     )}
                   </Button>
                 </CollapsibleTrigger>
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 flex-wrap">
                     <CardTitle className="text-lg">{goal.title}</CardTitle>
                     <Badge variant="outline" className={priorityColors[goal.priority]}>
                       {goal.priority}
                     </Badge>
                     <Badge className={statusColors[goal.status]}>
                       {statusLabels[goal.status]}
                     </Badge>
                   </div>
                   {goal.description && (
                     <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                   )}
                   <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                     {goal.deadline && (
                       <div className="flex items-center gap-1">
                         <Calendar className="h-3.5 w-3.5" />
                         <span>{format(new Date(goal.deadline), 'MMM d, yyyy')}</span>
                         {daysRemaining !== null && (
                           <span className={cn(
                             'ml-1',
                             daysRemaining < 0 ? 'text-red-500' : daysRemaining <= 7 ? 'text-yellow-500' : ''
                           )}>
                             ({daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`})
                           </span>
                         )}
                       </div>
                     )}
                     <span>{milestones.length} milestones</span>
                   </div>
                 </div>
               </div>
               <div className="flex items-center gap-2 shrink-0">
                 <Button variant="ghost" size="icon" onClick={onEdit}>
                   <Edit2 className="h-4 w-4" />
                 </Button>
                 <Button variant="ghost" size="icon" onClick={onDelete}>
                   <Trash2 className="h-4 w-4 text-destructive" />
                 </Button>
               </div>
             </div>
             <div className="mt-4 pl-14">
               <div className="flex items-center gap-2">
                 <Progress value={progress} className="flex-1 h-2" />
                 <span className="text-sm font-medium w-10 text-right">{progress}%</span>
               </div>
             </div>
           </CardHeader>
           
           <CollapsibleContent>
             <CardContent className="pt-0 pl-16">
               <div className="border-t border-border pt-4">
                 <div className="flex items-center justify-between mb-3">
                   <h4 className="text-sm font-medium">Milestones</h4>
                   <Button variant="outline" size="sm" onClick={onAddMilestone}>
                     <Plus className="h-3 w-3 mr-1" />
                     Add
                   </Button>
                 </div>
                 
                 {milestones.length === 0 ? (
                   <p className="text-sm text-muted-foreground py-4 text-center">
                     No milestones yet. Add milestones to track progress.
                   </p>
                 ) : (
                   <div className="space-y-2">
                     {milestones.map((milestone) => (
                       <div
                         key={milestone.id}
                         className={cn(
                           'flex items-center gap-3 p-3 rounded-lg border',
                           milestone.status === 'completed' ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/50'
                         )}
                       >
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-6 w-6 shrink-0"
                           onClick={() => onToggleMilestone(milestone)}
                         >
                           <CheckCircle2 className={cn(
                             'h-4 w-4',
                             milestone.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'
                           )} />
                         </Button>
                         <div className="flex-1 min-w-0">
                           <p className={cn(
                             'text-sm font-medium',
                             milestone.status === 'completed' && 'line-through text-muted-foreground'
                           )}>
                             {milestone.title}
                           </p>
                           {milestone.target_date && (
                             <p className="text-xs text-muted-foreground">
                               Due: {format(new Date(milestone.target_date), 'MMM d, yyyy')}
                             </p>
                           )}
                         </div>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-6 w-6 shrink-0"
                           onClick={() => onDeleteMilestone(milestone.id)}
                         >
                           <Trash2 className="h-3 w-3 text-destructive" />
                         </Button>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </CardContent>
           </CollapsibleContent>
         </Collapsible>
       </Card>
     </div>
   );
 }