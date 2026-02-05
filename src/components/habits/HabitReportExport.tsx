 import React, { useState } from 'react';
 import { FileDown, FileText, Calendar } from 'lucide-react';
 import { format, startOfWeek, endOfWeek, startOfMonth } from 'date-fns';
 import { Button } from '@/components/ui/button';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import { toast } from 'sonner';
 import { Habit, HabitLog, HabitStreak, HabitStats } from '@/types/habits';
 import { generateWeeklyReport, generateMonthlyReport } from '@/services/habitReportService';
 
 interface HabitReportExportProps {
   habits: Habit[];
   logs: HabitLog[];
   streaks: HabitStreak[];
   stats: HabitStats;
   currentDate?: Date;
 }
 
 export function HabitReportExport({
   habits,
   logs,
   streaks,
   stats,
   currentDate = new Date(),
 }: HabitReportExportProps) {
   const [isExporting, setIsExporting] = useState(false);
 
   const handleExportWeekly = async () => {
     setIsExporting(true);
     try {
       generateWeeklyReport(habits, logs, streaks, stats, currentDate);
       toast.success('Weekly report exported successfully!');
     } catch (error) {
       console.error('Export error:', error);
       toast.error('Failed to export report');
     } finally {
       setIsExporting(false);
     }
   };
 
   const handleExportMonthly = async () => {
     setIsExporting(true);
     try {
       generateMonthlyReport(habits, logs, streaks, stats, currentDate);
       toast.success('Monthly report exported successfully!');
     } catch (error) {
       console.error('Export error:', error);
       toast.error('Failed to export report');
     } finally {
       setIsExporting(false);
     }
   };
 
   const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
   const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
   const monthStart = startOfMonth(currentDate);
 
 
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button variant="outline" size="sm" className="gap-2" disabled={isExporting}>
           <FileDown className="w-4 h-4" />
           Export
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end" className="w-56">
         <DropdownMenuLabel>Export Report</DropdownMenuLabel>
         <DropdownMenuSeparator />
         <DropdownMenuItem onClick={handleExportWeekly}>
           <FileText className="w-4 h-4 mr-2" />
           <div className="flex flex-col">
             <span>Weekly Report</span>
             <span className="text-xs text-muted-foreground">
               {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
             </span>
           </div>
         </DropdownMenuItem>
         <DropdownMenuItem onClick={handleExportMonthly}>
           <Calendar className="w-4 h-4 mr-2" />
           <div className="flex flex-col">
             <span>Monthly Report</span>
             <span className="text-xs text-muted-foreground">
               {format(monthStart, 'MMMM yyyy')}
             </span>
           </div>
         </DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
   );
 }