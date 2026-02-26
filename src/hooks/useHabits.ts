import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Habit, HabitLog, HabitCategory, HabitStreak, HabitStats } from '@/types/habits';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format, startOfDay, endOfDay, eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<HabitCategory[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [streaks, setStreaks] = useState<HabitStreak[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all habits data
  const fetchHabits = useCallback(async () => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const [habitsRes, categoriesRes, streaksRes] = await Promise.all([
        supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_archived', false)
          .order('sort_order', { ascending: true }),
        supabase
          .from('habit_categories')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('habit_streaks')
          .select('*')
          .eq('user_id', user.id),
      ]);

      if (habitsRes.error) throw habitsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (streaksRes.error) throw streaksRes.error;

      // Map habits with their categories and streaks
      const habitsWithData = (habitsRes.data || []).map(habit => ({
        ...habit,
        category: categoriesRes.data?.find(c => c.id === habit.category_id),
        streak: streaksRes.data?.find(s => s.habit_id === habit.id),
      }));

      setHabits(habitsWithData as Habit[]);
      setCategories(categoriesRes.data || []);
      setStreaks(streaksRes.data || []);
    } catch (error: any) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch logs for a date range
  const fetchLogs = useCallback(async (startDate: Date, endDate: Date) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('log_date', format(startDate, 'yyyy-MM-dd'))
        .lte('log_date', format(endDate, 'yyyy-MM-dd'));

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching logs:', error);
    }
  }, [user]);

  // Create habit
  const createHabit = useCallback(async (habitData: Partial<Habit>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          title: habitData.title!,
          description: habitData.description,
          category_id: habitData.category_id,
          priority: habitData.priority || 'medium',
          frequency: habitData.frequency || 'daily',
          custom_days: habitData.custom_days || [],
          target_type: habitData.target_type || 'yes_no',
          target_value: habitData.target_value || 1,
          target_unit: habitData.target_unit,
          start_date: habitData.start_date,
          end_date: habitData.end_date,
          notes: habitData.notes,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchHabits();
      toast.success('Habit created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
      return null;
    }
  }, [user, fetchHabits]);

  // Update habit
  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchHabits();
      toast.success('Habit updated');
      return true;
    } catch (error: any) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
      return false;
    }
  }, [user, fetchHabits]);

  // Delete habit
  const deleteHabit = useCallback(async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setHabits(prev => prev.filter(h => h.id !== id));
      toast.success('Habit deleted');
      return true;
    } catch (error: any) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
      return false;
    }
  }, [user]);

  // Toggle habit log for a specific date
  const toggleHabitLog = useCallback(async (habitId: string, date: Date, value?: number) => {
    if (!user) return false;

    const dateStr = format(date, 'yyyy-MM-dd');
    const existingLog = logs.find(l => l.habit_id === habitId && l.log_date === dateStr);

    try {
      if (existingLog) {
        // Toggle completion
        const { error } = await supabase
          .from('habit_logs')
          .update({ 
            completed: !existingLog.completed,
            value: value ?? existingLog.value,
          })
          .eq('id', existingLog.id);

        if (error) throw error;
        
        setLogs(prev => prev.map(l => 
          l.id === existingLog.id 
            ? { ...l, completed: !l.completed, value: value ?? l.value }
            : l
        ));
      } else {
        // Create new log
        const { data, error } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            log_date: dateStr,
            completed: true,
            value: value ?? 1,
          })
          .select()
          .single();

        if (error) throw error;
        setLogs(prev => [...prev, data]);
      }

      // Refresh streaks
      const { data: streakData } = await supabase
        .from('habit_streaks')
        .select('*')
        .eq('habit_id', habitId)
        .single();
      
      if (streakData) {
        setStreaks(prev => {
          const exists = prev.some(s => s.habit_id === habitId);
          if (exists) {
            return prev.map(s => s.habit_id === habitId ? streakData : s);
          }
          return [...prev, streakData];
        });
      }

      return true;
    } catch (error: any) {
      console.error('Error toggling habit log:', error);
      toast.error('Failed to update habit');
      return false;
    }
  }, [user, logs]);

  // Update log value (for count/duration types)
  const updateLogValue = useCallback(async (habitId: string, date: Date, value: number) => {
    if (!user) return false;

    const dateStr = format(date, 'yyyy-MM-dd');
    const existingLog = logs.find(l => l.habit_id === habitId && l.log_date === dateStr);

    try {
      if (existingLog) {
        const { error } = await supabase
          .from('habit_logs')
          .update({ value, completed: value > 0 })
          .eq('id', existingLog.id);

        if (error) throw error;
        setLogs(prev => prev.map(l => 
          l.id === existingLog.id ? { ...l, value, completed: value > 0 } : l
        ));
      } else {
        const { data, error } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            log_date: dateStr,
            completed: value > 0,
            value,
          })
          .select()
          .single();

        if (error) throw error;
        setLogs(prev => [...prev, data]);
      }
      return true;
    } catch (error: any) {
      console.error('Error updating log value:', error);
      return false;
    }
  }, [user, logs]);

  // Create category
  const createCategory = useCallback(async (name: string, color: string, icon?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('habit_categories')
        .insert({ name, color, icon, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => [...prev, data]);
      toast.success('Category created');
      return data;
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
      return null;
    }
  }, [user]);

  // Calculate stats
  const stats = useMemo((): HabitStats => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayLogs = logs.filter(l => l.log_date === today);
    const completedToday = todayLogs.filter(l => l.completed).length;
    const longestStreak = Math.max(0, ...streaks.map(s => s.longest_streak));
    
    const activeHabits = habits.filter(h => h.status === 'in_progress' || h.status === 'pending');
    
    // Calculate average completion rate
    const totalPossibleLogs = habits.length * logs.length;
    const completedLogs = logs.filter(l => l.completed).length;
    const averageCompletion = totalPossibleLogs > 0 
      ? Math.round((completedLogs / totalPossibleLogs) * 100) 
      : 0;

    const overdueHabits = habits.filter(h => {
      if (!h.end_date) return false;
      return new Date(h.end_date) < new Date() && h.status !== 'completed';
    }).length;

    return {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      completedToday,
      longestStreak,
      averageCompletion,
      overdueHabits,
    };
  }, [habits, logs, streaks]);

  // Get log for specific habit and date
  const getLog = useCallback((habitId: string, date: Date): HabitLog | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return logs.find(l => l.habit_id === habitId && l.log_date === dateStr);
  }, [logs]);

  // Initial fetch
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return {
    habits,
    categories,
    logs,
    streaks,
    loading,
    stats,
    fetchHabits,
    fetchLogs,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitLog,
    updateLogValue,
    createCategory,
    getLog,
  };
}
