import React, { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { HabitCheckInGrid } from '@/components/habits/HabitCheckInGrid';
import { HabitForm } from '@/components/habits/HabitForm';
import { HabitHeatmap } from '@/components/habits/HabitHeatmap';
import { HabitStatsCards } from '@/components/habits/HabitStatsCards';
import { HabitAnalytics } from '@/components/habits/HabitAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainLayout } from '@/components/layout/MainLayout';
import { Habit } from '@/types/habits';

export default function Habits() {
  const { user, loading: authLoading } = useAuth();
  const { 
    habits, 
    logs, 
    categories, 
    streaks,
    stats: habitStats, 
    loading, 
    fetchLogs, 
    createHabit, 
    updateHabit, 
    deleteHabit, 
    toggleHabitLog, 
    updateLogValue, 
    createCategory 
  } = useHabits();
  const { goals, stats: goalStats } = useGoals();
  
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const now = new Date();
    fetchLogs(startOfMonth(now), endOfMonth(now));
  }, [fetchLogs]);

  const handleSubmit = async (data: Partial<Habit>) => {
    if (editingHabit) {
      await updateHabit(editingHabit.id, data);
    } else {
      await createHabit(data);
    }
    setEditingHabit(null);
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Habit Tracker</h1>
          <p className="text-muted-foreground">Build better habits, track your progress</p>
        </div>

        <HabitStatsCards habitStats={habitStats} goalStats={goalStats} />

        <Tabs defaultValue="grid" className="w-full">
          <TabsList>
            <TabsTrigger value="grid">Check-in Grid</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="mt-4">
            <HabitCheckInGrid
              habits={habits}
              logs={logs}
              onToggleLog={toggleHabitLog}
              onUpdateLogValue={updateLogValue}
              onEditHabit={(h) => { setEditingHabit(h); setShowForm(true); }}
              onDeleteHabit={deleteHabit}
              onAddHabit={() => setShowForm(true)}
            />
          </TabsContent>
          
          <TabsContent value="heatmap" className="mt-4">
            <HabitHeatmap logs={logs} totalHabits={habits.length} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <HabitAnalytics 
              habits={habits} 
              logs={logs} 
              streaks={streaks}
            />
          </TabsContent>
        </Tabs>
      </div>

      <HabitForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditingHabit(null); }}
        onSubmit={handleSubmit}
        habit={editingHabit}
        categories={categories}
        onCreateCategory={createCategory}
      />
    </MainLayout>
  );
}
