import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, getWeek } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Habit, HabitLog, HabitStreak } from '@/types/habits';

interface HabitAnalyticsProps {
  habits: Habit[];
  logs: HabitLog[];
  streaks: HabitStreak[];
}

export function HabitAnalytics({ habits, logs, streaks }: HabitAnalyticsProps) {
  // Weekly completion data
  const weeklyData = useMemo(() => {
    const today = new Date();
    const weeks = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(today, i * 7), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(subDays(today, i * 7), { weekStartsOn: 1 });
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      let completed = 0;
      let total = 0;
      
      weekDays.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        habits.forEach(habit => {
          total++;
          const log = logs.find(l => l.habit_id === habit.id && l.log_date === dateStr);
          if (log?.completed) completed++;
        });
      });
      
      weeks.push({
        week: `Week ${getWeek(weekStart)}`,
        completed,
        missed: total - completed,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
    
    return weeks;
  }, [habits, logs]);

  // Daily completion for the last 14 days
  const dailyData = useMemo(() => {
    const today = new Date();
    const days = [];
    
    for (let i = 13; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      let completed = 0;
      habits.forEach(habit => {
        const log = logs.find(l => l.habit_id === habit.id && l.log_date === dateStr);
        if (log?.completed) completed++;
      });
      
      days.push({
        date: format(date, 'MMM d'),
        completed,
        total: habits.length,
        rate: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0
      });
    }
    
    return days;
  }, [habits, logs]);

  // Streak comparison data
  const streakData = useMemo(() => {
    return habits.map(habit => {
      const streak = streaks.find(s => s.habit_id === habit.id);
      return {
        name: habit.title.length > 15 ? habit.title.slice(0, 15) + '...' : habit.title,
        current: streak?.current_streak || 0,
        longest: streak?.longest_streak || 0,
      };
    }).slice(0, 8); // Limit to 8 for readability
  }, [habits, streaks]);

  // Per-habit completion rate
  const habitCompletionData = useMemo(() => {
    const last30Days = 30;
    
    return habits.map(habit => {
      let completed = 0;
      for (let i = 0; i < last30Days; i++) {
        const dateStr = format(subDays(new Date(), i), 'yyyy-MM-dd');
        const log = logs.find(l => l.habit_id === habit.id && l.log_date === dateStr);
        if (log?.completed) completed++;
      }
      
      return {
        name: habit.title.length > 12 ? habit.title.slice(0, 12) + '...' : habit.title,
        rate: Math.round((completed / last30Days) * 100),
        completed,
        missed: last30Days - completed,
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [habits, logs]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name.includes('rate') || entry.name === 'Rate' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="habits">By Habit</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Completion Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="missed" fill="hsl(var(--destructive))" name="Missed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {weeklyData.map((week, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xs text-muted-foreground">{week.week}</p>
                    <p className="text-lg font-bold text-primary">{week.rate}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Completion Rate (Last 14 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorRate)"
                      name="Rate"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="streaks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Streak Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={streakData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="current" fill="hsl(var(--primary))" name="Current Streak" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="longest" fill="hsl(142, 76%, 36%)" name="Longest Streak" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="habits" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Completion Rate by Habit (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={habitCompletionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rate" fill="hsl(var(--primary))" name="Rate" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
