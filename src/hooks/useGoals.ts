import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Goal, Milestone, GoalStats } from '@/types/habits';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useGoals(userId?: string) {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.id;
  const [goals, setGoals] = useState<Goal[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all goals with milestones
  const fetchGoals = useCallback(async () => {
    if (!effectiveUserId) {
      setGoals([]);
      setMilestones([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const [goalsRes, milestonesRes] = await Promise.all([
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', effectiveUserId)
          .eq('is_archived', false)
          .order('sort_order', { ascending: true }),
        supabase
          .from('milestones')
          .select('*')
          .eq('user_id', effectiveUserId)
          .order('sort_order', { ascending: true }),
      ]);

      if (goalsRes.error) throw goalsRes.error;
      if (milestonesRes.error) throw milestonesRes.error;

      const allMilestones = milestonesRes.data || [];
      setMilestones(allMilestones as Milestone[]);

      const goalsWithMilestones = (goalsRes.data || []).map(goal => ({
        ...goal,
        milestones: allMilestones.filter(m => m.goal_id === goal.id) || [],
      }));

      setGoals(goalsWithMilestones as Goal[]);
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId]);

  // Create goal
  const createGoal = useCallback(async (goalData: Partial<Goal>) => {
    if (!effectiveUserId) return null;

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
          user_id: effectiveUserId,
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
  }, [effectiveUserId]);

  // Update goal
  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    if (!effectiveUserId) return false;

    try {
      const { error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', effectiveUserId);

      if (error) throw error;
      
      setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
      toast.success('Goal updated');
      return true;
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
      return false;
    }
  }, [effectiveUserId]);

  // Delete goal
  const deleteGoal = useCallback(async (id: string) => {
    if (!effectiveUserId) return false;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', effectiveUserId);

      if (error) throw error;
      
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Goal deleted');
      return true;
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
      return false;
    }
  }, [effectiveUserId]);

  // Create milestone
  const createMilestone = useCallback(async (milestoneData: { goal_id: string; title: string; description?: string | null; target_date?: string | null }) => {
    if (!effectiveUserId) return null;

    try {
      const { data, error } = await supabase
        .from('milestones')
        .insert({
          title: milestoneData.title,
          description: milestoneData.description,
          target_date: milestoneData.target_date,
          goal_id: milestoneData.goal_id,
          user_id: effectiveUserId,
        })
        .select()
        .single();

      if (error) throw error;
      
      const newMilestone = data as Milestone;
      setMilestones(prev => [...prev, newMilestone]);
      setGoals(prev => prev.map(g => {
        if (g.id === milestoneData.goal_id) {
          return { ...g, milestones: [...(g.milestones || []), newMilestone] };
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
  }, [effectiveUserId]);

  // Update milestone
  const updateMilestone = useCallback(async (id: string, updates: Partial<Milestone>) => {
    if (!effectiveUserId) return false;

    try {
      const { error } = await supabase
        .from('milestones')
        .update(updates)
        .eq('id', id)
        .eq('user_id', effectiveUserId);

      if (error) throw error;
      
      setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
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
  }, [effectiveUserId, goals, updateGoal]);

  // Delete milestone
  const deleteMilestone = useCallback(async (id: string) => {
    if (!effectiveUserId) return false;

    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id)
        .eq('user_id', effectiveUserId);

      if (error) throw error;
      
      setMilestones(prev => prev.filter(m => m.id !== id));
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
  }, [effectiveUserId]);

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
    milestones,
    loading,
    isLoading: loading,
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
