import { useMemo } from 'react';
import { Task } from '@/types/task';
import { Habit, HabitLog, HabitStreak, Goal } from '@/types/habits';
import { 
  format, parseISO, differenceInHours, differenceInDays,
  eachDayOfInterval, isBefore, isAfter, isWithinInterval,
  getDay, getHours, startOfDay, endOfDay
} from 'date-fns';

export interface ProductivityMetrics {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  overdueTasks: number;
  completionRate: number;
  avgCompletionTimeHours: number;
  tasksCompletedToday: number;
}

export interface DailyCompletionData {
  date: string;
  label: string;
  completed: number;
  created: number;
}

export interface PriorityDistribution {
  name: string;
  value: number;
  color: string;
}

export interface HabitInsight {
  totalHabits: number;
  activeHabits: number;
  avgStreak: number;
  bestStreak: number;
  completionRate: number;
  dailyCompletionData: { date: string; label: string; completed: number; total: number }[];
}

export interface GoalInsight {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  overdueGoals: number;
  avgProgress: number;
  priorityDistribution: PriorityDistribution[];
}

export interface AIInsight {
  type: 'info' | 'warning' | 'success' | 'tip';
  message: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

function isInRange(dateStr: string, range: DateRange): boolean {
  try {
    const d = parseISO(dateStr);
    return isWithinInterval(d, { start: startOfDay(range.from), end: endOfDay(range.to) });
  } catch { return false; }
}

export function useAnalytics(
  tasks: Task[],
  habits: Habit[],
  habitLogs: HabitLog[],
  streaks: HabitStreak[],
  goals: Goal[],
  dateRange?: DateRange
) {
  const now = new Date();

  const filteredTasks = useMemo(() => {
    if (!dateRange) return tasks;
    return tasks.filter(t => isInRange(t.createdAt, dateRange));
  }, [tasks, dateRange]);

  const filteredLogs = useMemo(() => {
    if (!dateRange) return habitLogs;
    return habitLogs.filter(l => {
      try {
        const d = parseISO(l.log_date);
        return isWithinInterval(d, { start: startOfDay(dateRange.from), end: endOfDay(dateRange.to) });
      } catch { return false; }
    });
  }, [habitLogs, dateRange]);

  const productivityMetrics = useMemo((): ProductivityMetrics => {
    const completedTasks = filteredTasks.filter(t => t.done);
    const activeTasks = filteredTasks.filter(t => !t.done);
    const overdueTasks = filteredTasks.filter(t => !t.done && t.due && isBefore(parseISO(t.due), now));
    
    const today = format(now, 'yyyy-MM-dd');
    const tasksCompletedToday = completedTasks.filter(t => 
      format(parseISO(t.createdAt), 'yyyy-MM-dd') === today && t.done
    ).length;

    const completedWithDue = completedTasks.filter(t => t.due);
    const avgCompletionTimeHours = completedWithDue.length > 0
      ? completedWithDue.reduce((sum, t) => sum + Math.abs(differenceInHours(parseISO(t.due!), parseISO(t.createdAt))), 0) / completedWithDue.length
      : 0;

    return {
      totalTasks: filteredTasks.length,
      completedTasks: completedTasks.length,
      activeTasks: activeTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate: filteredTasks.length > 0 ? Math.round((completedTasks.length / filteredTasks.length) * 100) : 0,
      avgCompletionTimeHours: Math.round(avgCompletionTimeHours),
      tasksCompletedToday,
    };
  }, [filteredTasks]);

  const dailyCompletionData = useMemo((): DailyCompletionData[] => {
    const rangeFrom = dateRange?.from ?? new Date(now.getTime() - 13 * 86400000);
    const rangeTo = dateRange?.to ?? now;
    const days = eachDayOfInterval({ start: rangeFrom, end: rangeTo });
    // Limit to last 60 days max for performance
    const limitedDays = days.length > 60 ? days.slice(-60) : days;
    return limitedDays.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const completed = filteredTasks.filter(t => t.done && format(parseISO(t.createdAt), 'yyyy-MM-dd') === dateStr).length;
      const created = filteredTasks.filter(t => format(parseISO(t.createdAt), 'yyyy-MM-dd') === dateStr).length;
      return { date: dateStr, label: format(day, 'MMM dd'), completed, created };
    });
  }, [filteredTasks, dateRange]);

  const priorityDistribution = useMemo((): PriorityDistribution[] => {
    const high = filteredTasks.filter(t => t.priority === 'High').length;
    const medium = filteredTasks.filter(t => t.priority === 'Medium').length;
    const low = filteredTasks.filter(t => t.priority === 'Low').length;
    return [
      { name: 'High', value: high, color: 'hsl(0, 75%, 55%)' },
      { name: 'Medium', value: medium, color: 'hsl(38, 95%, 55%)' },
      { name: 'Low', value: low, color: 'hsl(150, 70%, 45%)' },
    ];
  }, [filteredTasks]);

  const statusDistribution = useMemo((): PriorityDistribution[] => {
    const completed = filteredTasks.filter(t => t.done).length;
    const active = filteredTasks.filter(t => !t.done && (!t.due || !isBefore(parseISO(t.due), now))).length;
    const overdue = filteredTasks.filter(t => !t.done && t.due && isBefore(parseISO(t.due), now)).length;
    return [
      { name: 'Completed', value: completed, color: 'hsl(150, 70%, 45%)' },
      { name: 'Active', value: active, color: 'hsl(220, 70%, 55%)' },
      { name: 'Overdue', value: overdue, color: 'hsl(0, 75%, 55%)' },
    ];
  }, [filteredTasks]);

  const habitInsight = useMemo((): HabitInsight => {
    const activeHabits = habits.filter(h => !h.is_archived);
    const avgStreak = streaks.length > 0
      ? Math.round(streaks.reduce((s, st) => s + (st.current_streak || 0), 0) / streaks.length)
      : 0;
    const bestStreak = streaks.length > 0 ? Math.max(...streaks.map(s => s.longest_streak || 0)) : 0;
    const completedLogs = filteredLogs.filter(l => l.completed).length;
    const completionRate = filteredLogs.length > 0 ? Math.round((completedLogs / filteredLogs.length) * 100) : 0;

    const rangeFrom = dateRange?.from ?? new Date(now.getTime() - 13 * 86400000);
    const rangeTo = dateRange?.to ?? now;
    const days = eachDayOfInterval({ start: rangeFrom, end: rangeTo });
    const limitedDays = days.length > 60 ? days.slice(-60) : days;
    const dailyCompletionData = limitedDays.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayLogs = filteredLogs.filter(l => l.log_date === dateStr);
      const completed = dayLogs.filter(l => l.completed).length;
      return { date: dateStr, label: format(day, 'MMM dd'), completed, total: activeHabits.length };
    });

    return { totalHabits: habits.length, activeHabits: activeHabits.length, avgStreak, bestStreak, completionRate, dailyCompletionData };
  }, [habits, filteredLogs, streaks, dateRange]);

  const goalInsight = useMemo((): GoalInsight => {
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const inProgressGoals = goals.filter(g => g.status === 'in_progress').length;
    const overdueGoals = goals.filter(g => g.deadline && isBefore(new Date(g.deadline), now) && g.status !== 'completed').length;
    const avgProgress = goals.length > 0 ? Math.round(goals.reduce((s, g) => s + (g.progress_percentage || 0), 0) / goals.length) : 0;
    const priorityDistribution: PriorityDistribution[] = [
      { name: 'High', value: goals.filter(g => g.priority === 'high').length, color: 'hsl(0, 75%, 55%)' },
      { name: 'Medium', value: goals.filter(g => g.priority === 'medium').length, color: 'hsl(38, 95%, 55%)' },
      { name: 'Low', value: goals.filter(g => g.priority === 'low').length, color: 'hsl(150, 70%, 45%)' },
    ];
    return { totalGoals: goals.length, completedGoals, inProgressGoals, overdueGoals, avgProgress, priorityDistribution };
  }, [goals]);

  const aiInsights = useMemo((): AIInsight[] => {
    const insights: AIInsight[] = [];
    const { completionRate, overdueTasks, totalTasks, avgCompletionTimeHours } = productivityMetrics;

    if (totalTasks === 0) {
      insights.push({ type: 'info', message: "No tasks found in this period. Start adding tasks to see productivity insights!" });
      return insights;
    }

    if (completionRate >= 80) {
      insights.push({ type: 'success', message: `Excellent! You have a ${completionRate}% task completion rate. Your productivity is outstanding.` });
    } else if (completionRate >= 50) {
      insights.push({ type: 'info', message: `Your task completion rate is ${completionRate}%. Try breaking large tasks into smaller ones to improve.` });
    } else if (completionRate > 0) {
      insights.push({ type: 'warning', message: `Your completion rate is ${completionRate}%. Consider reducing your daily task load to focus on fewer, higher-impact tasks.` });
    }

    if (overdueTasks > 0) {
      insights.push({ type: 'warning', message: `You have ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}. Review and reschedule or complete them to stay on track.` });
    }

    if (avgCompletionTimeHours > 0) {
      if (avgCompletionTimeHours < 24) {
        insights.push({ type: 'success', message: `Average task turnaround is ${avgCompletionTimeHours}h — you're completing tasks quickly!` });
      } else if (avgCompletionTimeHours > 72) {
        insights.push({ type: 'tip', message: `Tasks take an average of ${Math.round(avgCompletionTimeHours / 24)} days to complete. Try setting tighter deadlines.` });
      }
    }

    // Day-of-week pattern
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const tasksByDay = [0, 0, 0, 0, 0, 0, 0];
    filteredTasks.forEach(t => { tasksByDay[getDay(parseISO(t.createdAt))]++; });
    const busiestDay = tasksByDay.indexOf(Math.max(...tasksByDay));
    if (Math.max(...tasksByDay) > 0) {
      insights.push({ type: 'tip', message: `Your busiest day is ${dayNames[busiestDay]}. Consider distributing tasks more evenly across the week.` });
    }

    // Habit insights
    if (habitInsight.bestStreak > 7) {
      insights.push({ type: 'success', message: `Your best habit streak is ${habitInsight.bestStreak} days! Consistency is key to building lasting habits.` });
    }
    if (habitInsight.completionRate < 50 && habitInsight.totalHabits > 0) {
      insights.push({ type: 'warning', message: `Your habit completion rate is ${habitInsight.completionRate}%. Try starting with fewer habits to build momentum.` });
    }

    // Goal predictions
    if (goalInsight.inProgressGoals > 0 && goalInsight.avgProgress > 0) {
      const daysToComplete = Math.round((100 - goalInsight.avgProgress) / Math.max(goalInsight.avgProgress / 30, 1));
      insights.push({ type: 'info', message: `At your current pace, in-progress goals may reach completion in ~${daysToComplete} days. Keep pushing!` });
    }

    if (goalInsight.overdueGoals > 0) {
      insights.push({ type: 'warning', message: `${goalInsight.overdueGoals} goal${goalInsight.overdueGoals > 1 ? 's are' : ' is'} past deadline. Review and adjust timelines.` });
    }
    if (goalInsight.completedGoals > 0) {
      insights.push({ type: 'success', message: `You've completed ${goalInsight.completedGoals} goal${goalInsight.completedGoals > 1 ? 's' : ''}! Great progress.` });
    }

    // High priority ratio
    const highPriorityRatio = filteredTasks.length > 0 ? filteredTasks.filter(t => t.priority === 'High').length / filteredTasks.length : 0;
    if (highPriorityRatio > 0.5) {
      insights.push({ type: 'tip', message: "Over 50% of your tasks are high-priority. If everything is urgent, nothing is. Re-evaluate priorities." });
    }

    // Weekly digest summary
    const rangeSpan = dateRange ? differenceInDays(dateRange.to, dateRange.from) : 14;
    if (rangeSpan >= 7) {
      const weeklyAvg = Math.round(productivityMetrics.completedTasks / Math.max(rangeSpan / 7, 1));
      insights.push({ type: 'info', message: `Weekly summary: You complete ~${weeklyAvg} tasks per week with a ${completionRate}% success rate across this period.` });
    }

    return insights.slice(0, 8);
  }, [productivityMetrics, filteredTasks, habitInsight, goalInsight, dateRange]);

  return {
    productivityMetrics,
    dailyCompletionData,
    priorityDistribution,
    statusDistribution,
    habitInsight,
    goalInsight,
    aiInsights,
  };
}
