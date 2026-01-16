import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Trophy 
} from 'lucide-react';
import { HabitStats, GoalStats } from '@/types/habits';

interface HabitStatsCardsProps {
  habitStats: HabitStats;
  goalStats: GoalStats;
}

export function HabitStatsCards({ habitStats, goalStats }: HabitStatsCardsProps) {
  const cards = [
    {
      title: 'Active Habits',
      value: habitStats.activeHabits,
      subtitle: `of ${habitStats.totalHabits} total`,
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Longest Streak',
      value: habitStats.longestStreak,
      subtitle: 'days in a row',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Completion Rate',
      value: `${habitStats.averageCompletion}%`,
      subtitle: 'average completion',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Overdue Habits',
      value: habitStats.overdueHabits,
      subtitle: 'need attention',
      icon: AlertTriangle,
      color: habitStats.overdueHabits > 0 ? 'text-red-500' : 'text-muted-foreground',
      bgColor: habitStats.overdueHabits > 0 ? 'bg-red-500/10' : 'bg-muted',
    },
    {
      title: 'Goals Progress',
      value: `${goalStats.averageProgress}%`,
      subtitle: `${goalStats.completedGoals} completed`,
      icon: Trophy,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Completed Today',
      value: habitStats.completedToday,
      subtitle: 'habits done',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-card rounded-xl border border-border/50 p-4"
        >
          <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <div className="text-2xl font-bold text-foreground">{card.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{card.subtitle}</div>
          <div className="text-sm font-medium text-foreground mt-1">{card.title}</div>
        </motion.div>
      ))}
    </div>
  );
}
