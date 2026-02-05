 import { useEffect, useCallback, useRef } from 'react';
 import { Habit, HabitLog, HabitStreak } from '@/types/habits';
 import { format, subDays } from 'date-fns';
 import { toast } from 'sonner';
 
 interface HabitAlert {
   type: 'streak_break' | 'needs_attention' | 'reminder';
   habitId: string;
   habitTitle: string;
   message: string;
 }
 
 export function useHabitNotifications(
   habits: Habit[],
   logs: HabitLog[],
   streaks: HabitStreak[]
 ) {
   const permissionRef = useRef<NotificationPermission>('default');
   const alertsShownRef = useRef<Set<string>>(new Set());
 
   // Request notification permission
   const requestPermission = useCallback(async () => {
     if (!('Notification' in window)) {
       console.log('This browser does not support notifications');
       return false;
     }
 
     if (Notification.permission === 'granted') {
       permissionRef.current = 'granted';
       return true;
     }
 
     if (Notification.permission !== 'denied') {
       const permission = await Notification.requestPermission();
       permissionRef.current = permission;
       return permission === 'granted';
     }
 
     return false;
   }, []);
 
   // Show browser notification
   const showNotification = useCallback((title: string, body: string, tag: string) => {
     if (permissionRef.current !== 'granted') return;
 
     const notification = new Notification(title, {
       body,
       icon: '/favicon.ico',
       tag,
       requireInteraction: false,
     });
 
     // Play sound
     try {
       const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleS0TKZjJ3r1+RicIMX7M4shxNRQAIXbF4chpLwz/GWvD5cZiKAb/EVjB582VVBsC/wdLwuvTj1UaAP8AQ8Tw14lQFf7+PsT03oRLEPz8OcX35n9GC/r5NMn66XpBBvf2McwAAHY8Avb0LtEDAXI3APTzK9UGBm8yAO/wKNkJCmoqAO/uJN0NCmYjAO7sH+AQDGIdAOzpG+MTDl0WAOrmFuUWEFkQAOfiEugZEVQJAOTeCusaEU8D/+DbB+4bEEoA/93XA/EcD0YA/NrRAPQeD0L+99nNAPchDz/89tXKAPslDjz67tfH/fkoDTO379bF+/wrDDD039bE+f8vDC3u49fD+P8yDCrq5trC9gA2DCfm6t3B8gA6DSPi7+C/7gE+DyDe8+K97AFBEBzb9+W76gNFEhnY+ui55gRJFBbV/eu24QZMFhTT/u6z3gZPGRHS/fCw2gdSGw/Q/PKu1ghVHQ7O+vSr0wdYHwzN+fas0AdaIAvL9/mq0AZdIgvK9fqp0AVfJArJ9Pyn0QNZJQ==');
       audio.volume = 0.3;
       audio.play().catch(() => {});
     } catch {
       // Audio not supported
     }
 
     notification.onclick = () => {
       window.focus();
       notification.close();
     };
   }, []);
 
   // Check for streak breaks (habits not completed yesterday)
   const checkStreakBreaks = useCallback((): HabitAlert[] => {
     const alerts: HabitAlert[] = [];
     const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
     const today = format(new Date(), 'yyyy-MM-dd');
 
     habits.forEach(habit => {
       // Only check daily habits
       if (habit.frequency !== 'daily') return;
       if (habit.is_archived) return;
 
       const streak = streaks.find(s => s.habit_id === habit.id);
       const hadStreak = streak && streak.current_streak && streak.current_streak > 0;
       
       // Check if yesterday was missed
       const yesterdayLog = logs.find(
         l => l.habit_id === habit.id && l.log_date === yesterday && l.completed
       );
       
       // Check if today is done
       const todayLog = logs.find(
         l => l.habit_id === habit.id && l.log_date === today && l.completed
       );
 
       // If had a streak and missed yesterday, and today not done yet
       if (hadStreak && !yesterdayLog && !todayLog) {
         alerts.push({
           type: 'streak_break',
           habitId: habit.id,
           habitTitle: habit.title,
           message: `Your ${streak!.current_streak}-day streak for "${habit.title}" is at risk! Complete it today to keep going.`,
         });
       }
     });
 
     return alerts;
   }, [habits, logs, streaks]);
 
   // Check for habits needing attention today
   const checkHabitsNeedingAttention = useCallback((): HabitAlert[] => {
     const alerts: HabitAlert[] = [];
     const today = format(new Date(), 'yyyy-MM-dd');
 
     habits.forEach(habit => {
       if (habit.is_archived) return;
       if (habit.frequency !== 'daily') return;
 
       // Check if today is done
       const todayLog = logs.find(
         l => l.habit_id === habit.id && l.log_date === today && l.completed
       );
 
       if (!todayLog) {
         const streak = streaks.find(s => s.habit_id === habit.id);
         const currentStreak = streak?.current_streak || 0;
         
         if (currentStreak >= 7) {
           alerts.push({
             type: 'needs_attention',
             habitId: habit.id,
             habitTitle: habit.title,
             message: `Don't forget "${habit.title}" today! You're on a ${currentStreak}-day streak.`,
           });
         }
       }
     });
 
     return alerts;
   }, [habits, logs, streaks]);
 
   // Get habits that need attention today
   const getHabitsNeedingAttention = useCallback(() => {
     const today = format(new Date(), 'yyyy-MM-dd');
     
     return habits.filter(habit => {
       if (habit.is_archived) return false;
       if (habit.frequency !== 'daily') return false;
       
       const todayLog = logs.find(
         l => l.habit_id === habit.id && l.log_date === today && l.completed
       );
       
       return !todayLog;
     });
   }, [habits, logs]);
 
   // Show alerts via toast
   const showAlerts = useCallback(() => {
     const streakBreakAlerts = checkStreakBreaks();
     const attentionAlerts = checkHabitsNeedingAttention();
 
     // Show streak break alerts first (higher priority)
     streakBreakAlerts.forEach(alert => {
       const alertKey = `${alert.type}-${alert.habitId}-${format(new Date(), 'yyyy-MM-dd')}`;
       if (!alertsShownRef.current.has(alertKey)) {
         toast.warning(alert.message, {
           duration: 10000,
           action: {
             label: 'View Habits',
             onClick: () => window.location.href = '/habits',
           },
         });
         alertsShownRef.current.add(alertKey);
         
         // Also show browser notification
         showNotification('Streak at Risk! 🔥', alert.message, alertKey);
       }
     });
 
     // Show attention alerts (limit to 3 to avoid spam)
     attentionAlerts.slice(0, 3).forEach(alert => {
       const alertKey = `${alert.type}-${alert.habitId}-${format(new Date(), 'yyyy-MM-dd')}`;
       if (!alertsShownRef.current.has(alertKey)) {
         toast.info(alert.message, {
           duration: 5000,
         });
         alertsShownRef.current.add(alertKey);
       }
     });
   }, [checkStreakBreaks, checkHabitsNeedingAttention, showNotification]);
 
   // Auto-check alerts when habits/logs change
   useEffect(() => {
     if (habits.length > 0 && logs.length > 0) {
       // Small delay to avoid showing on initial load
       const timer = setTimeout(() => {
         showAlerts();
       }, 2000);
       return () => clearTimeout(timer);
     }
   }, [habits, logs, showAlerts]);
 
   return {
     requestPermission,
     showAlerts,
     getHabitsNeedingAttention,
     checkStreakBreaks,
   };
 }