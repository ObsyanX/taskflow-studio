import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useAuthContext } from '@/contexts/AuthContext';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { HabitCheckInGrid } from '@/components/habits/HabitCheckInGrid';
import { HabitForm } from '@/components/habits/HabitForm';
import { HabitHeatmap } from '@/components/habits/HabitHeatmap';
import { HabitStatsCards } from '@/components/habits/HabitStatsCards';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Habit } from '@/types/habits';

export default function Habits() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuthContext();
  const { habits, logs, categories, stats: habitStats, loading, fetchLogs, createHabit, updateHabit, deleteHabit, toggleHabitLog, updateLogValue, createCategory } = useHabits();
  const { goals, stats: goalStats } = useGoals();
  
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated, navigate]);

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Habit Tracker</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={() => signOut()}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <HabitStatsCards habitStats={habitStats} goalStats={goalStats} />

        <Tabs defaultValue="grid" className="w-full">
          <TabsList>
            <TabsTrigger value="grid">Check-in Grid</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
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
        </Tabs>
      </main>

      <HabitForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditingHabit(null); }}
        onSubmit={handleSubmit}
        habit={editingHabit}
        categories={categories}
        onCreateCategory={createCategory}
      />
    </div>
  );
}
