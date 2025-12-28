import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/todo/Header';
import { TaskForm } from '@/components/todo/TaskForm';
import { FilterBar } from '@/components/todo/FilterBar';
import { TaskList } from '@/components/todo/TaskList';
import { EditTaskDialog } from '@/components/todo/EditTaskDialog';
import { UndoToast } from '@/components/todo/UndoToast';
import { DeleteConfirmDialog } from '@/components/todo/DeleteConfirmDialog';
import { Spotlight } from '@/components/todo/Spotlight';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import { useDebounce } from '@/hooks/useDebounce';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNotifications } from '@/hooks/useNotifications';
import { Task, FilterType, SortType, Priority, ReminderTime } from '@/types/task';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  
  // UI State
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Tasks
  const {
    tasks,
    filteredTasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    restoreTask,
    markReminderFired,
    stats,
  } = useTasks(filter, sortBy, debouncedSearch);

  // Notifications
  const { requestPermission } = useNotifications(tasks, markReminderFired);

  // Request notification permission on mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Handlers
  const handleAddTask = useCallback((
    title: string,
    desc: string,
    due: string | null,
    priority: Priority,
    reminder: ReminderTime
  ) => {
    addTask(title, desc, due, priority, reminder);
  }, [addTask]);

  const handleRequestDelete = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setTaskToDelete(task);
    }
  }, [tasks]);

  const handleConfirmDelete = useCallback(() => {
    if (taskToDelete) {
      const task = deleteTask(taskToDelete.id);
      if (task) {
        setDeletedTask(task);
      }
      setTaskToDelete(null);
    }
  }, [taskToDelete, deleteTask]);

  const handleCancelDelete = useCallback(() => {
    setTaskToDelete(null);
  }, []);

  const handleUndo = useCallback(() => {
    if (deletedTask) {
      restoreTask(deletedTask);
      setDeletedTask(null);
    }
  }, [deletedTask, restoreTask]);

  const handleDismissUndo = useCallback(() => {
    setDeletedTask(null);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleSaveEdit = useCallback((
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt'>>
  ) => {
    updateTask(id, updates);
  }, [updateTask]);

  const handleCloseEdit = useCallback(() => {
    setEditingTask(null);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewTask: () => setIsFormExpanded(true),
    onFocusSearch: () => searchInputRef.current?.focus(),
    onToggleTheme: toggleTheme,
    onEscape: () => {
      if (taskToDelete) {
        setTaskToDelete(null);
      } else if (editingTask) {
        setEditingTask(null);
      } else if (isFormExpanded) {
        setIsFormExpanded(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-background theme-transition">
      <Spotlight enabled={true} />

      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 mx-auto max-w-2xl px-3 py-6 sm:px-6 sm:py-12"
      >
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          stats={stats}
        />

        <TaskForm
          onSubmit={handleAddTask}
          isExpanded={isFormExpanded}
          onToggleExpand={() => setIsFormExpanded(!isFormExpanded)}
        />

        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchInputRef={searchInputRef}
          stats={stats}
        />

        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onToggle={toggleTask}
          onEdit={handleEditTask}
          onDelete={handleRequestDelete}
        />

        <footer className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">N</kbd> for new task, <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">/</kbd> to search
          </p>
        </footer>
      </motion.main>

      <EditTaskDialog
        task={editingTask}
        isOpen={!!editingTask}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmDialog
        isOpen={!!taskToDelete}
        taskTitle={taskToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <UndoToast
        deletedTask={deletedTask}
        onUndo={handleUndo}
        onDismiss={handleDismissUndo}
      />
    </div>
  );
};

export default Index;
