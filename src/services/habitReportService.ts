 import jsPDF from 'jspdf';
 import autoTable from 'jspdf-autotable';
 import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
 import { Habit, HabitLog, HabitStreak, HabitStats } from '@/types/habits';
 
 interface ReportData {
   habits: Habit[];
   logs: HabitLog[];
   streaks: HabitStreak[];
   stats: HabitStats;
   startDate: Date;
   endDate: Date;
   reportType: 'weekly' | 'monthly';
 }
 
 export function generateHabitReport(data: ReportData): void {
   const { habits, logs, streaks, stats, startDate, endDate, reportType } = data;
   const doc = new jsPDF();
   
   const days = eachDayOfInterval({ start: startDate, end: endDate });
 
   // Title
   doc.setFontSize(24);
   doc.setTextColor(99, 102, 241); // Indigo
   doc.text(`${reportType === 'weekly' ? 'Weekly' : 'Monthly'} Habit Report`, 14, 25);
   
   // Date range
   doc.setFontSize(12);
   doc.setTextColor(100);
   doc.text(`${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`, 14, 35);
 
   // Stats Summary
   doc.setFontSize(14);
   doc.setTextColor(0);
   doc.text('Summary', 14, 50);
 
   const statsData = [
     ['Total Habits', stats.totalHabits.toString()],
     ['Active Habits', stats.activeHabits.toString()],
     ['Completed Today', stats.completedToday.toString()],
     ['Longest Streak', `${stats.longestStreak} days`],
     ['Average Completion', `${stats.averageCompletion}%`],
   ];
 
   autoTable(doc, {
     startY: 55,
     head: [['Metric', 'Value']],
     body: statsData,
     theme: 'striped',
     headStyles: { fillColor: [99, 102, 241] },
     margin: { left: 14, right: 14 },
   });
 
   // Habit Performance Table
   let currentY = (doc as any).lastAutoTable.finalY + 15;
   
   doc.setFontSize(14);
   doc.text('Habit Performance', 14, currentY);
 
   const habitTableData = habits.map(habit => {
     const habitLogs = logs.filter(l => l.habit_id === habit.id);
     const completedDays = habitLogs.filter(l => l.completed).length;
     const streak = streaks.find(s => s.habit_id === habit.id);
     const completionRate = days.length > 0 
       ? Math.round((completedDays / days.length) * 100) 
       : 0;
 
     return [
       habit.title,
       habit.priority,
       `${completedDays}/${days.length}`,
       `${completionRate}%`,
       streak?.current_streak?.toString() || '0',
       streak?.longest_streak?.toString() || '0',
     ];
   });
 
   autoTable(doc, {
     startY: currentY + 5,
     head: [['Habit', 'Priority', 'Completed', 'Rate', 'Current Streak', 'Best Streak']],
     body: habitTableData,
     theme: 'striped',
     headStyles: { fillColor: [99, 102, 241] },
     margin: { left: 14, right: 14 },
     columnStyles: {
       0: { cellWidth: 50 },
       1: { cellWidth: 25 },
       2: { cellWidth: 25 },
       3: { cellWidth: 20 },
       4: { cellWidth: 30 },
       5: { cellWidth: 25 },
     },
   });
 
   // Daily Breakdown
   currentY = (doc as any).lastAutoTable.finalY + 15;
   
   // Check if we need a new page
   if (currentY > 250) {
     doc.addPage();
     currentY = 20;
   }
 
   doc.setFontSize(14);
   doc.text('Daily Breakdown', 14, currentY);
 
   const dailyData = days.map(day => {
     const dateStr = format(day, 'yyyy-MM-dd');
     const dayLogs = logs.filter(l => l.log_date === dateStr);
     const completed = dayLogs.filter(l => l.completed).length;
     const rate = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
     
     return [
       format(day, 'EEE, MMM d'),
       `${completed}/${habits.length}`,
       `${rate}%`,
       rate === 100 ? '✓ Perfect' : rate >= 50 ? 'Good' : rate > 0 ? 'Needs Work' : 'Missed',
     ];
   });
 
   autoTable(doc, {
     startY: currentY + 5,
     head: [['Date', 'Completed', 'Rate', 'Status']],
     body: dailyData,
     theme: 'striped',
     headStyles: { fillColor: [99, 102, 241] },
     margin: { left: 14, right: 14 },
   });
 
   // Footer
   const pageCount = doc.getNumberOfPages();
   for (let i = 1; i <= pageCount; i++) {
     doc.setPage(i);
     doc.setFontSize(10);
     doc.setTextColor(150);
     doc.text(
       `Generated on ${format(new Date(), 'MMM d, yyyy')} | Page ${i} of ${pageCount}`,
       doc.internal.pageSize.width / 2,
       doc.internal.pageSize.height - 10,
       { align: 'center' }
     );
   }
 
   // Save the PDF
   const fileName = `habit-report-${reportType}-${format(startDate, 'yyyy-MM-dd')}.pdf`;
   doc.save(fileName);
 }
 
 export function generateWeeklyReport(
   habits: Habit[],
   logs: HabitLog[],
   streaks: HabitStreak[],
   stats: HabitStats,
   date: Date = new Date()
 ): void {
   const startDate = startOfWeek(date, { weekStartsOn: 1 });
   const endDate = endOfWeek(date, { weekStartsOn: 1 });
   
   generateHabitReport({
     habits,
     logs,
     streaks,
     stats,
     startDate,
     endDate,
     reportType: 'weekly',
   });
 }
 
 export function generateMonthlyReport(
   habits: Habit[],
   logs: HabitLog[],
   streaks: HabitStreak[],
   stats: HabitStats,
   date: Date = new Date()
 ): void {
   const startDate = startOfMonth(date);
   const endDate = endOfMonth(date);
   
   generateHabitReport({
     habits,
     logs,
     streaks,
     stats,
     startDate,
     endDate,
     reportType: 'monthly',
   });
 }