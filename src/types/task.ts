export type Priority = 'High' | 'Medium' | 'Low';

export type ReminderTime = '5min' | '15min' | '30min' | '1hour' | '1day' | 'none';

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
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'date' | 'priority' | 'title';
