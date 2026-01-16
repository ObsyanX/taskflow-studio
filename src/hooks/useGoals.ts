import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Goal, Milestone, GoalStats } from '@/types/habits';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all goals with milestones
  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const [goalsRes, milestonesRes] = await Promise.all([
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_archived', false)
          .order('sort_order', { ascending: true }),
        supabase
          .from('milestones')
          .select('*')
          .eq('user_id', user.id)
          .order('sort_order', { ascending: true }),
      ]);

      if (goalsRes.error) throw goalsRes.error;
      if (milestonesRes.error) throw milestonesRes.error;

      const goalsWithMilestones = (goalsRes.data || []).map(goal => ({
        ...goal,
        milestones: milestonesRes.data?.filter(m => m.goal_id === goal.id) || [],
      }));

      setGoals(goalsWithMilestones as Goal[]);
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create goal
  const createGoal = useCallback(async (goalData: Partial<Goal>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          title: goalData.title!,
          description: goalData.description,
          priority: goalData.priority || 'medium',
          start_date: goalData.start_date,
          deadline: goalData.deadline,
          notes: goalData.notes,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      const newGoal: Goal = {
        ...data,
        priority: data.priority as 'high' | 'medium' | 'low',
        status: data.status as any,
        milestones: [],
      };
      setGoals(prev => [...prev, newGoal]);
      toast.success('Goal created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
      return null;
    }
  }, [user]);

  // Update goal
  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
      toast.success('Goal updated');
      return true;
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
      return false;
    }
  }, [user]);

  // Delete goal
  const deleteGoal = useCallback(async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Goal deleted');
      return true;
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
      return false;
    }
  }, [user]);

  // Create milestone
  const createMilestone = useCallback(async (goalId: string, milestoneData: Partial<Milestone>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('milestones')
        .insert({
          title: milestoneData.title!,
          description: milestoneData.description,
          target_date: milestoneData.target_date,
          goal_id: goalId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setGoals(prev => prev.map(g => {
        if (g.id === goalId) {
          return { ...g, milestones: [...(g.milestones || []), data] };
        }
        return g;
      }));
      
      toast.success('Milestone created');
      return data;
    } catch (error: any) {
      console.error('Error creating milestone:', error);
      toast.error('Failed to create milestone');
      return null;
    }
  }, [user]);

  // Update milestone
  const updateMilestone = useCallback(async (id: string, updates: Partial<Milestone>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('milestones')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setGoals(prev => prev.map(g => ({
        ...g,
        milestones: g.milestones?.map(m => m.id === id ? { ...m, ...updates } : m),
      })));
      
      // Recalculate goal progress
      const goal = goals.find(g => g.milestones?.some(m => m.id === id));
      if (goal && goal.milestones) {
        const completedMilestones = goal.milestones.filter(m => 
          m.id === id ? updates.status === 'completed' : m.status === 'completed'
        ).length;
        const progress = Math.round((completedMilestones / goal.milestones.length) * 100);
        await updateGoal(goal.id, { progress_percentage: progress });
      }
      
      return true;
    } catch (error: any) {
      console.error('Error updating milestone:', error);
      toast.error('Failed to update milestone');
      return false;
    }
  }, [user, goals, updateGoal]);

  // Delete milestone
  const deleteMilestone = useCallback(async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setGoals(prev => prev.map(g => ({
        ...g,
        milestones: g.milestones?.filter(m => m.id !== id),
      })));
      
      toast.success('Milestone deleted');
      return true;
    } catch (error: any) {
      console.error('Error deleting milestone:', error);
      toast.error('Failed to delete milestone');
      return false;
    }
  }, [user]);

  // Calculate stats
  const stats = useMemo((): GoalStats => {
    const activeGoals = goals.filter(g => g.status === 'in_progress' || g.status === 'not_started');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const overdueGoals = goals.filter(g => {
      if (!g.deadline) return false;
      return new Date(g.deadline) < new Date() && g.status !== 'completed';
    });
    
    const averageProgress = goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress_percentage, 0) / goals.length)
      : 0;

    return {
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      overdueGoals: overdueGoals.length,
      averageProgress,
    };
  }, [goals]);

  // Initial fetch
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    stats,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    createMilestone,
    updateMilestone,
    deleteMilestone,
  };
}
