-- Create enums for habit tracking
CREATE TYPE public.habit_frequency AS ENUM ('daily', 'weekly', 'custom');
CREATE TYPE public.habit_target_type AS ENUM ('yes_no', 'count', 'duration');
CREATE TYPE public.habit_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
CREATE TYPE public.goal_status AS ENUM ('not_started', 'in_progress', 'completed', 'overdue');
CREATE TYPE public.milestone_status AS ENUM ('pending', 'completed', 'overdue');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.habit_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create habits table
CREATE TABLE public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.habit_categories(id) ON DELETE SET NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  frequency habit_frequency NOT NULL DEFAULT 'daily',
  custom_days INTEGER[] DEFAULT '{}',
  target_type habit_target_type NOT NULL DEFAULT 'yes_no',
  target_value INTEGER DEFAULT 1,
  target_unit TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  status habit_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create habit_logs table for daily check-ins
CREATE TABLE public.habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  value INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(habit_id, log_date)
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  deadline DATE,
  status goal_status NOT NULL DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create milestones table
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status milestone_status NOT NULL DEFAULT 'pending',
  sort_order INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create habit_goal_links table for linking habits to goals
CREATE TABLE public.habit_goal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(habit_id, goal_id)
);

-- Create habit_task_links table for linking habits to tasks
CREATE TABLE public.habit_task_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(habit_id, task_id)
);

-- Create streaks table for tracking habit streaks
CREATE TABLE public.habit_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  streak_start_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(habit_id)
);

-- Create indexes for performance
CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_habits_status ON public.habits(status);
CREATE INDEX idx_habits_start_date ON public.habits(start_date);
CREATE INDEX idx_habit_logs_habit_id ON public.habit_logs(habit_id);
CREATE INDEX idx_habit_logs_log_date ON public.habit_logs(log_date);
CREATE INDEX idx_habit_logs_user_date ON public.habit_logs(user_id, log_date);
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_milestones_goal_id ON public.milestones(goal_id);
CREATE INDEX idx_habit_streaks_habit_id ON public.habit_streaks(habit_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_goal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_task_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_streaks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Habit categories policies
CREATE POLICY "Users can view their own categories" ON public.habit_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own categories" ON public.habit_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON public.habit_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON public.habit_categories FOR DELETE USING (auth.uid() = user_id);

-- Habits policies
CREATE POLICY "Users can view their own habits" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- Habit logs policies
CREATE POLICY "Users can view their own habit logs" ON public.habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habit logs" ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habit logs" ON public.habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habit logs" ON public.habit_logs FOR DELETE USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view their own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Milestones policies
CREATE POLICY "Users can view their own milestones" ON public.milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own milestones" ON public.milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own milestones" ON public.milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own milestones" ON public.milestones FOR DELETE USING (auth.uid() = user_id);

-- Habit-goal links policies
CREATE POLICY "Users can view their habit-goal links" ON public.habit_goal_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.habits WHERE id = habit_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create habit-goal links" ON public.habit_goal_links FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.habits WHERE id = habit_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete habit-goal links" ON public.habit_goal_links FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.habits WHERE id = habit_id AND user_id = auth.uid())
);

-- Habit-task links policies
CREATE POLICY "Users can view their habit-task links" ON public.habit_task_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.habits WHERE id = habit_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create habit-task links" ON public.habit_task_links FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.habits WHERE id = habit_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete habit-task links" ON public.habit_task_links FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.habits WHERE id = habit_id AND user_id = auth.uid())
);

-- Habit streaks policies
CREATE POLICY "Users can view their own streaks" ON public.habit_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own streaks" ON public.habit_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks" ON public.habit_streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own streaks" ON public.habit_streaks FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_habit_logs_updated_at BEFORE UPDATE ON public.habit_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_habit_streaks_updated_at BEFORE UPDATE ON public.habit_streaks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup - create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate and update streak
CREATE OR REPLACE FUNCTION public.update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_current_streak INTEGER := 0;
  v_longest_streak INTEGER := 0;
  v_last_date DATE;
  v_streak_start DATE;
  v_habit_user_id UUID;
BEGIN
  -- Get the habit's user_id
  SELECT user_id INTO v_habit_user_id FROM public.habits WHERE id = NEW.habit_id;
  
  -- Calculate current streak
  WITH consecutive_days AS (
    SELECT 
      log_date,
      log_date - (ROW_NUMBER() OVER (ORDER BY log_date))::INTEGER AS grp
    FROM public.habit_logs
    WHERE habit_id = NEW.habit_id AND completed = true
    ORDER BY log_date DESC
  ),
  streaks AS (
    SELECT 
      grp,
      COUNT(*) as streak_length,
      MAX(log_date) as end_date,
      MIN(log_date) as start_date
    FROM consecutive_days
    GROUP BY grp
  )
  SELECT 
    COALESCE(streak_length, 0),
    end_date,
    start_date
  INTO v_current_streak, v_last_date, v_streak_start
  FROM streaks
  WHERE end_date = CURRENT_DATE OR end_date = CURRENT_DATE - 1
  ORDER BY end_date DESC
  LIMIT 1;
  
  -- Get longest streak
  WITH consecutive_days AS (
    SELECT 
      log_date,
      log_date - (ROW_NUMBER() OVER (ORDER BY log_date))::INTEGER AS grp
    FROM public.habit_logs
    WHERE habit_id = NEW.habit_id AND completed = true
  ),
  streaks AS (
    SELECT COUNT(*) as streak_length
    FROM consecutive_days
    GROUP BY grp
  )
  SELECT COALESCE(MAX(streak_length), 0) INTO v_longest_streak FROM streaks;
  
  -- Upsert streak record
  INSERT INTO public.habit_streaks (habit_id, user_id, current_streak, longest_streak, last_completed_date, streak_start_date)
  VALUES (NEW.habit_id, v_habit_user_id, COALESCE(v_current_streak, 0), v_longest_streak, v_last_date, v_streak_start)
  ON CONFLICT (habit_id) DO UPDATE SET
    current_streak = COALESCE(v_current_streak, 0),
    longest_streak = GREATEST(public.habit_streaks.longest_streak, v_longest_streak),
    last_completed_date = v_last_date,
    streak_start_date = v_streak_start,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update streak on habit log changes
CREATE TRIGGER update_streak_on_log
  AFTER INSERT OR UPDATE ON public.habit_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_habit_streak();