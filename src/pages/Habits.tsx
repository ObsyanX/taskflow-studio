 import React, { useState, useEffect, useCallback } from 'react';
 import { endOfMonth, subMonths } from 'date-fns';
 
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { HabitCheckInGrid } from '@/components/habits/HabitCheckInGrid';
import { HabitForm } from '@/components/habits/HabitForm';
import { HabitHeatmap } from '@/components/habits/HabitHeatmap';
import { HabitStatsCards } from '@/components/habits/HabitStatsCards';
import { HabitAnalytics } from '@/components/habits/HabitAnalytics';
import { HabitReportExport } from '@/components/habits/HabitReportExport';
import { NotificationSoundPicker } from '@/components/habits/NotificationSoundPicker';
 import { useHabitNotifications } from '@/hooks/useHabitNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Button } from '@/components/ui/button';
 import { Bell, BellRing } from 'lucide-react';
 import { toast } from 'sonner';

import { Habit } from '@/types/habits';

 export default function Habits() { 
   const { loading: authLoading } = useAuth();
  const { 
    habits, 
    archivedHabits,
    logs, 
    categories, 
    streaks,
    stats: habitStats, 
    loading, 
    fetchLogs, 
    createHabit, 
    updateHabit, 
    deleteHabit, 
    archiveHabit,
    toggleHabitLog, 
    updateLogValue, 
    createCategory 
  } = useHabits();
   
   // Handle habit reordering
   const handleReorderHabits = useCallback(async (habitIds: string[]) => {
     // Update sort_order for each habit
     for (let i = 0; i < habitIds.length; i++) {
       const habitId = habitIds[i];
       const habit = habits.find(h => h.id === habitId);
       if (habit && habit.sort_order !== i) {
         await updateHabit(habitId, { sort_order: i });
       }
     }
   }, [habits, updateHabit]);
   
   const { 
     requestPermission, 
     getHabitsNeedingAttention 
   } = useHabitNotifications(habits, logs, streaks);
   
   const { stats: goalStats } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
   const [notificationsEnabled, setNotificationsEnabled] = useState(false);
 
   const habitsNeedingAttention = getHabitsNeedingAttention();
   
    const handleEnableNotifications = async () => {
      if (!('Notification' in window)) {
        toast.info('Notifications are not supported in this browser. Alerts will show as in-app toasts.');
        setNotificationsEnabled(true);
        return;
      }
      const granted = await requestPermission();
      setNotificationsEnabled(granted);
      if (granted) {
        toast.success('Notifications enabled! You\'ll receive streak break alerts.');
      } else {
        // Still enable in-app toast alerts even if browser notifications are denied
        setNotificationsEnabled(true);
        toast.info('Browser notifications denied, but in-app alerts are enabled.');
      }
    };
 
   // Fetch logs for a wider range to support reports
   useEffect(() => {
     const now = new Date();
     const threeMonthsAgo = subMonths(now, 3);
     fetchLogs(threeMonthsAgo, endOfMonth(now));
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
      <>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
           <div>
             <h1 className="text-2xl font-bold">Habit Tracker</h1>
             <p className="text-muted-foreground">Build better habits, track your progress</p>
             {habitsNeedingAttention.length > 0 && (
               <p className="text-sm text-orange-500 mt-1">
                 {habitsNeedingAttention.length} habit{habitsNeedingAttention.length > 1 ? 's' : ''} need attention today
               </p>
             )}
           </div>
           <div className="flex items-center gap-2">
             <Button
               variant={notificationsEnabled ? "default" : "outline"}
               size="sm"
               onClick={handleEnableNotifications}
               className="gap-2"
             >
               {notificationsEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
               {notificationsEnabled ? 'Alerts On' : 'Enable Alerts'}
              </Button>
              <NotificationSoundPicker />
             <HabitReportExport
               habits={habits}
               logs={logs}
               streaks={streaks}
               stats={habitStats}
             />
           </div>
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
              archivedHabits={archivedHabits}
              logs={logs}
              onToggleLog={toggleHabitLog}
              onUpdateLogValue={updateLogValue}
              onEditHabit={(h) => { setEditingHabit(h); setShowForm(true); }}
              onDeleteHabit={deleteHabit}
              onAddHabit={() => setShowForm(true)}
               onReorderHabits={handleReorderHabits}
               onArchiveHabit={archiveHabit}
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
