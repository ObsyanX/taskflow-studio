import { useCallback, useMemo, useState, useEffect } from 'react';
import { Task, FilterType, SortType, Priority } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { filterTasks, sortTasks } from '@/utils/helpers';

interface UseTasksReturn {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  addTask: (title: string, desc?: string, due?: string | null, priority?: Priority) => Promise<Task | null>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<Task | undefined>;
  toggleTask: (id: string) => Promise<void>;
  restoreTask: (task: Task) => Promise<void>;
  clearCompleted: () => Promise<void>;
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from database
  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }

    const mappedTasks: Task[] = (data || []).map(row => ({
      id: row.id,
      title: row.title,
      desc: row.description || '',
      due: row.due_date,
      priority: row.priority as Priority,
      done: row.done,
      createdAt: row.created_at,
    }));

    setTasks(mappedTasks);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (
    title: string,
    desc: string = '',
    due: string | null = null,
    priority: Priority = 'Medium'
  ): Promise<Task | null> => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: title.trim(),
        description: desc.trim(),
        due_date: due,
        priority,
        done: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      return null;
    }

    const newTask: Task = {
      id: data.id,
      title: data.title,
      desc: data.description || '',
      due: data.due_date,
      priority: data.priority as Priority,
      done: data.done,
      createdAt: data.created_at,
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.desc !== undefined) dbUpdates.description = updates.desc;
    if (updates.due !== undefined) dbUpdates.due_date = updates.due;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.done !== undefined) dbUpdates.done = updates.done;

    const { error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<Task | undefined> => {
    const taskToDelete = tasks.find(task => task.id === id);

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return undefined;
    }

    setTasks(prev => prev.filter(task => task.id !== id));
    return taskToDelete;
  }, [tasks]);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await updateTask(id, { done: !task.done });
  }, [tasks, updateTask]);

  const restoreTask = useCallback(async (task: Task) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        id: task.id,
        title: task.title,
        description: task.desc,
        due_date: task.due,
        priority: task.priority,
        done: task.done,
        created_at: task.createdAt,
      })
      .select()
      .single();

    if (error) {
      console.error('Error restoring task:', error);
      return;
    }

    const restoredTask: Task = {
      id: data.id,
      title: data.title,
      desc: data.description || '',
      due: data.due_date,
      priority: data.priority as Priority,
      done: data.done,
      createdAt: data.created_at,
    };

    setTasks(prev => {
      const insertIndex = prev.findIndex(t => 
        new Date(t.createdAt) < new Date(restoredTask.createdAt)
      );
      
      if (insertIndex === -1) {
        return [...prev, restoredTask];
      }
      
      const newTasks = [...prev];
      newTasks.splice(insertIndex, 0, restoredTask);
      return newTasks;
    });
  }, []);

  const clearCompleted = useCallback(async () => {
    const completedIds = tasks.filter(t => t.done).map(t => t.id);
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .in('id', completedIds);

    if (error) {
      console.error('Error clearing completed tasks:', error);
      return;
    }

    setTasks(prev => prev.filter(task => !task.done));
  }, [tasks]);

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
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    restoreTask,
    clearCompleted,
    stats,
  };
}
