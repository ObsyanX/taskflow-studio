import { useEffect, useCallback, useRef } from 'react';
import { Task, ReminderTime } from '@/types/task';

const REMINDER_OFFSETS: Record<ReminderTime, number> = {
  '5min': 5 * 60 * 1000,
  '15min': 15 * 60 * 1000,
  '30min': 30 * 60 * 1000,
  '1hour': 60 * 60 * 1000,
  '1day': 24 * 60 * 60 * 1000,
  'none': 0,
};

export function useNotifications(
  tasks: Task[],
  onReminderFired: (taskId: string) => void
) {
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const permissionRef = useRef<NotificationPermission>('default');

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

  // Show notification
  const showNotification = useCallback((task: Task) => {
    if (permissionRef.current !== 'granted') return;

    const notification = new Notification(`Reminder: ${task.title}`, {
      body: task.desc || `Due: ${new Date(task.due!).toLocaleString()}`,
      icon: '/favicon.ico',
      tag: task.id,
      requireInteraction: true,
    });

    // Play sound
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleS0TKZjJ3r1+RicIMX7M4shxNRQAIXbF4chpLwz/GWvD5cZiKAb/EVjB582VVBsC/wdLwuvTj1UaAP8AQ8Tw14lQFf7+PsT03oRLEPz8OcX35n9GC/r5NMn66XpBBvf2McwAAHY8Avb0LtEDAXI3APTzK9UGBm8yAO/wKNkJCmoqAO/uJN0NCmYjAO7sH+AQDGIdAOzpG+MTDl0WAOrmFuUWEFkQAOfiEugZEVQJAOTeCusaEU8D/+DbB+4bEEoA/93XA/EcD0YA/NrRAPQeD0L+99nNAPchDz/89tXKAPslDjz67tfH/fkoDTO379bF+/wrDDD039bE+f8vDC3u49fD+P8yDCrq5trC9gA2DCfm6t3B8gA6DSPi7+C/7gE+DyDe8+K97AFBEBzb9+W76gNFEhnY+ui55gRJFBbV/eu24QZMFhTT/u6z3gZPGRHS/fCw2gdSGw/Q/PKu1ghVHQ7O+vSr0wdYHwzN+fas0AdaIAvL9/mq0AZdIgvK9fqp0AVfJArJ9Pyn0QNZJQ==');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {
      // Audio not supported
    }

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    onReminderFired(task.id);
  }, [onReminderFired]);

  // Schedule reminders
  useEffect(() => {
    // Clear existing timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();

    const now = Date.now();

    tasks.forEach((task) => {
      // Skip if no due date, already done, no reminder, or reminder already fired
      if (!task.due || task.done || task.reminder === 'none' || task.reminderFired) {
        return;
      }

      const dueTime = new Date(task.due).getTime();
      const reminderOffset = REMINDER_OFFSETS[task.reminder];
      const reminderTime = dueTime - reminderOffset;
      const delay = reminderTime - now;

      // Only schedule if reminder is in the future
      if (delay > 0) {
        const timeout = setTimeout(() => {
          showNotification(task);
        }, delay);
        timeoutsRef.current.set(task.id, timeout);
      } else if (delay > -60000 && delay <= 0) {
        // If reminder was within the last minute, show it now
        showNotification(task);
      }
    });

    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, [tasks, showNotification]);

  return { requestPermission };
}

export function getReminderLabel(reminder: ReminderTime): string {
  switch (reminder) {
    case '5min': return '5 minutes before';
    case '15min': return '15 minutes before';
    case '30min': return '30 minutes before';
    case '1hour': return '1 hour before';
    case '1day': return '1 day before';
    case 'none': return 'No reminder';
  }
}
