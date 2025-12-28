import { useCallback, useMemo } from 'react';
import { Task, FilterType, SortType, Priority, ReminderTime } from '@/types/task';
import { useLocalStorage } from './useLocalStorage';
import { filterTasks, sortTasks } from '@/utils/helpers';
import { v4 as uuidv4 } from 'uuid';

interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  addTask: (title: string, desc?: string, due?: string | null, priority?: Priority, reminder?: ReminderTime) => Task;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => Task | undefined;
  toggleTask: (id: string) => void;
  restoreTask: (task: Task) => void;
  clearCompleted: () => void;
  markReminderFired: (id: string) => void;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export function useTasks(
  filter: FilterType = 'all',
  sortBy: SortType = 'date',
  searchQuery: string = ''
): UseTasksReturn {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow-tasks', []);

  const addTask = useCallback((
    title: string,
    desc: string = '',
    due: string | null = null,
    priority: Priority = 'Medium',
    reminder: ReminderTime = 'none'
  ): Task => {
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      desc: desc.trim(),
      due,
      priority,
      done: false,
      createdAt: new Date().toISOString(),
      reminder,
      reminderFired: false,
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, [setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((id: string): Task | undefined => {
    let taskToDelete: Task | undefined;
    setTasks(prev => {
      taskToDelete = prev.find(task => task.id === id);
      return prev.filter(task => task.id !== id);
    });
    return taskToDelete;
  }, [setTasks]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }, [setTasks]);

  const restoreTask = useCallback((task: Task) => {
    setTasks(prev => {
      const insertIndex = prev.findIndex(t => 
        new Date(t.createdAt) < new Date(task.createdAt)
      );
      
      if (insertIndex === -1) {
        return [...prev, task];
      }
      
      const newTasks = [...prev];
      newTasks.splice(insertIndex, 0, task);
      return newTasks;
    });
  }, [setTasks]);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.done));
  }, [setTasks]);

  const markReminderFired = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, reminderFired: true } : task
      )
    );
  }, [setTasks]);

  const filteredTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filter, searchQuery);
    return sortTasks(filtered, sortBy);
  }, [tasks, filter, sortBy, searchQuery]);

  const stats = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter(t => !t.done).length,
    completed: tasks.filter(t => t.done).length,
  }), [tasks]);

  return {
    tasks,
    filteredTasks,
    loading: false,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    restoreTask,
    clearCompleted,
    markReminderFired,
    stats,
  };
}
