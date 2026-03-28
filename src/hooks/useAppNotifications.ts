import { useState, useCallback, useEffect } from 'react';
import { AppNotification } from '@/components/notifications/NotificationCenter';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'bloomscheduler_notifications';

function load(): AppNotification[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function save(notifications: AppNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export function useAppNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(load);

  useEffect(() => { save(notifications); }, [notifications]);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'read' | 'timestamp'>) => {
    const newNotif: AppNotification = {
      ...n,
      id: uuidv4(),
      read: false,
      timestamp: Date.now(),
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50)); // Keep max 50

    // Also send browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(n.title, { body: n.message, icon: '/placeholder.svg' });
    }
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const requestPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    addNotification,
    markRead,
    markAllRead,
    deleteNotification,
    clearAll,
    requestPermission,
    unreadCount: notifications.filter(n => !n.read).length,
  };
}
