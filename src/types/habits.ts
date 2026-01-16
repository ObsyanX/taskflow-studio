export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type HabitTargetType = 'yes_no' | 'count' | 'duration';
export type HabitStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';
export type MilestoneStatus = 'pending' | 'completed' | 'overdue';

export interface HabitCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon?: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category_id?: string;
  category?: HabitCategory;
  priority: 'high' | 'medium' | 'low';
  frequency: HabitFrequency;
  custom_days: number[];
  target_type: HabitTargetType;
  target_value: number;
  target_unit?: string;
  start_date: string;
  end_date?: string;
  status: HabitStatus;
  notes?: string;
  sort_order: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  streak?: HabitStreak;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  log_date: string;
  completed: boolean;
  value?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HabitStreak {
  id: string;
  habit_id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date?: string;
  streak_start_date?: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  start_date: string;
  deadline?: string;
  status: GoalStatus;
  progress_percentage: number;
  notes?: string;
  sort_order: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  milestones?: Milestone[];
  linked_habits?: Habit[];
}

export interface Milestone {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  status: MilestoneStatus;
  sort_order: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  longestStreak: number;
  averageCompletion: number;
  overdueHabits: number;
}

export interface GoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  overdueGoals: number;
  averageProgress: number;
}

export interface DailyHabitData {
  date: string;
  completed: number;
  total: number;
  percentage: number;
}

export interface WeeklyHabitData {
  week: number;
  startDate: string;
  endDate: string;
  days: DailyHabitData[];
  totalCompleted: number;
  totalPossible: number;
  percentage: number;
}
