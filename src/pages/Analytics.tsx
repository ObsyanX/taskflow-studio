import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { useAnalytics, AIInsight } from '@/hooks/useAnalytics';
import { subMonths, endOfMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from '@/components/ui/chart';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
  ResponsiveContainer, Legend, Tooltip,
} from 'recharts';
import {
  CheckCircle2, Clock, AlertTriangle, TrendingUp,
  Target, Repeat, BarChart3, Lightbulb, Info, Flame,
  ListTodo, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['hsl(0, 75%, 55%)', 'hsl(38, 95%, 55%)', 'hsl(150, 70%, 45%)', 'hsl(220, 70%, 55%)'];

function StatCard({ title, value, subtitle, icon: Icon, trend }: {
  title: string; value: string | number; subtitle?: string;
  icon: React.ElementType; trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={cn(
            "rounded-lg p-2.5",
            trend === 'up' ? 'bg-green-500/10 text-green-600' :
            trend === 'down' ? 'bg-red-500/10 text-red-600' :
            'bg-primary/10 text-primary'
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({ insight }: { insight: AIInsight }) {
  const config = {
    info: { icon: Info, bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-600 dark:text-blue-400' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-600 dark:text-amber-400' },
    success: { icon: CheckCircle2, bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-600 dark:text-green-400' },
    tip: { icon: Lightbulb, bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-600 dark:text-purple-400' },
  }[insight.type];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border p-4', config.bg, config.border)}>
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.text)} />
      <p className="text-sm leading-relaxed">{insight.message}</p>
    </div>
  );
}

export default function Analytics() {
  const { loading: authLoading } = useAuth();
  const { tasks } = useTasks();
  const { habits, logs: habitLogs, streaks, loading: habitsLoading, fetchLogs } = useHabits();
  const { goals, loading: goalsLoading } = useGoals();

  useEffect(() => {
    const now = new Date();
    fetchLogs(subMonths(now, 3), endOfMonth(now));
  }, [fetchLogs]);

  const {
    productivityMetrics, dailyCompletionData, priorityDistribution,
    statusDistribution, habitInsight, goalInsight, aiInsights,
  } = useAnalytics(tasks, habits, habitLogs, streaks, goals);

  const loading = authLoading || habitsLoading || goalsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const areaChartConfig = {
    completed: { label: 'Completed', color: 'hsl(150, 70%, 45%)' },
    created: { label: 'Created', color: 'hsl(220, 70%, 55%)' },
  };

  const habitChartConfig = {
    completed: { label: 'Completed', color: 'hsl(265, 70%, 55%)' },
    total: { label: 'Total', color: 'hsl(220, 70%, 55%)' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground">Track your productivity trends and get AI-powered recommendations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Tasks" value={productivityMetrics.totalTasks} icon={ListTodo} />
        <StatCard title="Completed" value={productivityMetrics.completedTasks} icon={CheckCircle2} trend="up" />
        <StatCard title="Completion Rate" value={`${productivityMetrics.completionRate}%`} icon={TrendingUp}
          trend={productivityMetrics.completionRate >= 60 ? 'up' : 'down'} />
        <StatCard title="Overdue" value={productivityMetrics.overdueTasks} icon={AlertTriangle}
          trend={productivityMetrics.overdueTasks > 0 ? 'down' : 'up'} />
        <StatCard title="Active Habits" value={habitInsight.activeHabits} icon={Repeat} />
        <StatCard title="Goals Progress" value={`${goalInsight.avgProgress}%`} icon={Target}
          trend={goalInsight.avgProgress >= 50 ? 'up' : 'neutral'} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Task Completion Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Task Activity (Last 14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={areaChartConfig} className="h-[260px] w-full">
              <AreaChart data={dailyCompletionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="created" stackId="1"
                  stroke="hsl(220, 70%, 55%)" fill="hsl(220, 70%, 55%)" fillOpacity={0.15} />
                <Area type="monotone" dataKey="completed" stackId="2"
                  stroke="hsl(150, 70%, 45%)" fill="hsl(150, 70%, 45%)" fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Task Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusDistribution.filter(d => d.value > 0)} cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusDistribution.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Priority Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Task Priority Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {priorityDistribution.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Habit Daily Completion */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Habit Check-ins (Last 14 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={habitChartConfig} className="h-[240px] w-full">
              <BarChart data={habitInsight.dailyCompletionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" fill="hsl(265, 70%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Habit & Goal Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Best Streak" value={`${habitInsight.bestStreak} days`} icon={Flame} trend="up" />
        <StatCard title="Avg Streak" value={`${habitInsight.avgStreak} days`} icon={Repeat} />
        <StatCard title="Habit Rate" value={`${habitInsight.completionRate}%`} icon={CheckCircle2}
          trend={habitInsight.completionRate >= 60 ? 'up' : 'neutral'} />
        <StatCard title="Goals Done" value={goalInsight.completedGoals}
          subtitle={`of ${goalInsight.totalGoals}`} icon={Target} trend="up" />
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiInsights.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Add tasks, habits, and goals to receive personalized productivity insights.
            </p>
          ) : (
            aiInsights.map((insight, idx) => <InsightCard key={idx} insight={insight} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
