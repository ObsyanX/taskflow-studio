export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  desc: string;
  due: string | null;
  priority: Priority;
  done: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'date' | 'priority' | 'title';
