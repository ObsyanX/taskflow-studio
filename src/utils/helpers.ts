import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';
import { Priority, Task, SortType } from '@/types/task';

export const formatDueDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  
  const date = parseISO(dateStr);
  
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  
  return format(date, 'MMM d');
};

export const isDueDatePast = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  return isPast(date) && !isToday(date);
};

export const getPriorityWeight = (priority: Priority): number => {
  switch (priority) {
    case 'High': return 3;
    case 'Medium': return 2;
    case 'Low': return 1;
    default: return 0;
  }
};

export const sortTasks = (tasks: Task[], sortBy: SortType): Task[] => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      case 'date':
        if (!a.due && !b.due) return 0;
        if (!a.due) return 1;
        if (!b.due) return -1;
        return new Date(a.due).getTime() - new Date(b.due).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
};

export const filterTasks = (
  tasks: Task[],
  filter: 'all' | 'active' | 'completed',
  searchQuery: string
): Task[] => {
  let filtered = tasks;

  // Filter by status
  if (filter === 'active') {
    filtered = filtered.filter(task => !task.done);
  } else if (filter === 'completed') {
    filtered = filtered.filter(task => task.done);
  }

  // Filter by search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      task =>
        task.title.toLowerCase().includes(query) ||
        task.desc.toLowerCase().includes(query)
    );
  }

  return filtered;
};

// Haptic feedback simulation (vibration on supported devices)
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const durations = { light: 10, medium: 20, heavy: 30 };
    navigator.vibrate(durations[type]);
  }
};
