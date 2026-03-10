import { useMemo } from 'react';
import { Task } from '@/types/task';
import { Habit, HabitLog, HabitStreak, Goal } from '@/types/habits';
import { 
  format, parseISO, differenceInHours, subDays, startOfWeek, endOfWeek, 
  eachDayOfInterval, isAfter, isBefore, startOfDay, getDay, getHours 
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

export interface ActivityHeatmapData {
  day: number; // 0-6
  hour: number; // 0-23
  count: number;
}

export interface AIInsight {
  type: 'info' | 'warning' | 'success' | 'tip';
  message: string;
}

export function useAnalytics(
  tasks: Task[],
  habits: Habit[],
  habitLogs: HabitLog[],
  streaks: HabitStreak[],
  goals: Goal[]
) {
  const now = new Date();

  const productivityMetrics = useMemo((): ProductivityMetrics => {
    const completedTasks = tasks.filter(t => t.done);
    const activeTasks = tasks.filter(t => !t.done);
    const overdueTasks = tasks.filter(t => !t.done && t.due && isBefore(parseISO(t.due), now));
    
    const today = format(now, 'yyyy-MM-dd');
    const tasksCompletedToday = completedTasks.filter(t => 
      format(parseISO(t.createdAt), 'yyyy-MM-dd') === today && t.done
    ).length;

    // Avg completion time: approximate using createdAt to due (for completed tasks with due dates)
    const completedWithDue = completedTasks.filter(t => t.due);
    const avgCompletionTimeHours = completedWithDue.length > 0
      ? completedWithDue.reduce((sum, t) => sum + Math.abs(differenceInHours(parseISO(t.due!), parseISO(t.createdAt))), 0) / completedWithDue.length
      : 0;

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      activeTasks: activeTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
      avgCompletionTimeHours: Math.round(avgCompletionTimeHours),
      tasksCompletedToday,
    };
  }, [tasks]);

  const dailyCompletionData = useMemo((): DailyCompletionData[] => {
    const days = eachDayOfInterval({ start: subDays(now, 13), end: now });
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const completed = tasks.filter(t => t.done && format(parseISO(t.createdAt), 'yyyy-MM-dd') === dateStr).length;
      const created = tasks.filter(t => format(parseISO(t.createdAt), 'yyyy-MM-dd') === dateStr).length;
      return { date: dateStr, label: format(day, 'MMM dd'), completed, created };
    });
  }, [tasks]);

  const priorityDistribution = useMemo((): PriorityDistribution[] => {
    const high = tasks.filter(t => t.priority === 'High').length;
    const medium = tasks.filter(t => t.priority === 'Medium').length;
    const low = tasks.filter(t => t.priority === 'Low').length;
    return [
      { name: 'High', value: high, color: 'hsl(0, 75%, 55%)' },
      { name: 'Medium', value: medium, color: 'hsl(38, 95%, 55%)' },
      { name: 'Low', value: low, color: 'hsl(150, 70%, 45%)' },
    ];
  }, [tasks]);

  const statusDistribution = useMemo((): PriorityDistribution[] => {
    const completed = tasks.filter(t => t.done).length;
    const active = tasks.filter(t => !t.done && (!t.due || !isBefore(parseISO(t.due), now))).length;
    const overdue = tasks.filter(t => !t.done && t.due && isBefore(parseISO(t.due), now)).length;
    return [
      { name: 'Completed', value: completed, color: 'hsl(150, 70%, 45%)' },
      { name: 'Active', value: active, color: 'hsl(220, 70%, 55%)' },
      { name: 'Overdue', value: overdue, color: 'hsl(0, 75%, 55%)' },
    ];
  }, [tasks]);

  const activityHeatmap = useMemo((): ActivityHeatmapData[] => {
    const data: ActivityHeatmapData[] = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        data.push({ day, hour, count: 0 });
      }
    }
    tasks.forEach(t => {
      const d = parseISO(t.createdAt);
      const dayIdx = getDay(d);
      const hourIdx = getHours(d);
      const entry = data.find(e => e.day === dayIdx && e.hour === hourIdx);
      if (entry) entry.count++;
    });
    return data;
  }, [tasks]);

  const habitInsight = useMemo((): HabitInsight => {
    const activeHabits = habits.filter(h => !h.is_archived);
    const avgStreak = streaks.length > 0
      ? Math.round(streaks.reduce((s, st) => s + (st.current_streak || 0), 0) / streaks.length)
      : 0;
    const bestStreak = streaks.length > 0 ? Math.max(...streaks.map(s => s.longest_streak || 0)) : 0;
    const completedLogs = habitLogs.filter(l => l.completed).length;
    const completionRate = habitLogs.length > 0 ? Math.round((completedLogs / habitLogs.length) * 100) : 0;

    const days = eachDayOfInterval({ start: subDays(now, 13), end: now });
    const dailyCompletionData = days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayLogs = habitLogs.filter(l => l.log_date === dateStr);
      const completed = dayLogs.filter(l => l.completed).length;
      return { date: dateStr, label: format(day, 'MMM dd'), completed, total: activeHabits.length };
    });

    return { totalHabits: habits.length, activeHabits: activeHabits.length, avgStreak, bestStreak, completionRate, dailyCompletionData };
  }, [habits, habitLogs, streaks]);

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
    const { completionRate, overdueTasks, totalTasks, completedTasks } = productivityMetrics;

    if (totalTasks === 0) {
      insights.push({ type: 'info', message: "You haven't created any tasks yet. Start adding tasks to see productivity insights!" });
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

    // Day-of-week pattern analysis
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const tasksByDay = [0, 0, 0, 0, 0, 0, 0];
    tasks.forEach(t => { tasksByDay[getDay(parseISO(t.createdAt))]++; });
    const busiestDay = tasksByDay.indexOf(Math.max(...tasksByDay));
    const quietestDay = tasksByDay.indexOf(Math.min(...tasksByDay));
    if (Math.max(...tasksByDay) > 0) {
      insights.push({ type: 'tip', message: `Your busiest day is ${dayNames[busiestDay]}. Consider distributing tasks more evenly across the week for better balance.` });
    }

    // Habit insights
    if (habitInsight.bestStreak > 7) {
      insights.push({ type: 'success', message: `Your best habit streak is ${habitInsight.bestStreak} days! Consistency is key to building lasting habits.` });
    }
    if (habitInsight.completionRate < 50 && habitInsight.totalHabits > 0) {
      insights.push({ type: 'warning', message: `Your habit completion rate is ${habitInsight.completionRate}%. Try starting with fewer habits to build momentum.` });
    }

    // Goal insights
    if (goalInsight.overdueGoals > 0) {
      insights.push({ type: 'warning', message: `${goalInsight.overdueGoals} goal${goalInsight.overdueGoals > 1 ? 's are' : ' is'} past deadline. Review and adjust timelines.` });
    }
    if (goalInsight.completedGoals > 0) {
      insights.push({ type: 'success', message: `You've completed ${goalInsight.completedGoals} goal${goalInsight.completedGoals > 1 ? 's' : ''}! Great progress.` });
    }

    // High priority task ratio
    const highPriorityRatio = tasks.length > 0 ? tasks.filter(t => t.priority === 'High').length / tasks.length : 0;
    if (highPriorityRatio > 0.5) {
      insights.push({ type: 'tip', message: "Over 50% of your tasks are high-priority. If everything is urgent, nothing is. Re-evaluate priorities." });
    }

    return insights.slice(0, 6);
  }, [productivityMetrics, tasks, habitInsight, goalInsight]);

  return {
    productivityMetrics,
    dailyCompletionData,
    priorityDistribution,
    statusDistribution,
    activityHeatmap,
    habitInsight,
    goalInsight,
    aiInsights,
  };
}
