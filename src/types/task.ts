export type Priority = 'High' | 'Medium' | 'Low';

export type ReminderTime = '5min' | '15min' | '30min' | '1hour' | '1day' | 'none';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
}

export const DEFAULT_CATEGORIES: TaskCategory[] = [
  { id: 'work', name: 'Work', color: 'hsl(220, 70%, 55%)' },
  { id: 'personal', name: 'Personal', color: 'hsl(280, 70%, 55%)' },
  { id: 'health', name: 'Health', color: 'hsl(150, 70%, 45%)' },
  { id: 'shopping', name: 'Shopping', color: 'hsl(38, 95%, 55%)' },
  { id: 'finance', name: 'Finance', color: 'hsl(0, 75%, 55%)' },
];

export interface Task {
  id: string;
  title: string;
  desc: string;
  due: string | null;
  priority: Priority;
  done: boolean;
  createdAt: string;
  reminder: ReminderTime;
  reminderFired?: boolean;
  categoryId?: string;
  recurrence: RecurrenceType;
  parentTaskId?: string; // For recurring task instances
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'date' | 'priority' | 'title';
