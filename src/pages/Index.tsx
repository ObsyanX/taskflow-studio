import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { List, Calendar, CalendarDays, BookOpen } from 'lucide-react';
import { Header } from '@/components/todo/Header';
import { TaskForm } from '@/components/todo/TaskForm';
import { FilterBar } from '@/components/todo/FilterBar';
import { TaskList } from '@/components/todo/TaskList';
import { CalendarView } from '@/components/todo/CalendarView';
import { WeeklyAgendaView } from '@/components/todo/WeeklyAgendaView';
import { EditTaskDialog } from '@/components/todo/EditTaskDialog';
import { UndoToast } from '@/components/todo/UndoToast';
import { DeleteConfirmDialog } from '@/components/todo/DeleteConfirmDialog';
import { Spotlight } from '@/components/todo/Spotlight';
import { DiaryView } from '@/components/diary/DiaryView';
import { useTasks } from '@/hooks/useTasks';
import { useTheme } from '@/hooks/useTheme';
import { useDebounce } from '@/hooks/useDebounce';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNotifications } from '@/hooks/useNotifications';
import { Task, FilterType, SortType, Priority, ReminderTime, RecurrenceType } from '@/types/task';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type ViewMode = 'list' | 'calendar' | 'weekly' | 'diary';

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletedTask, setDeletedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [preselectedDate, setPreselectedDate] = useState<string | null>(null);

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
    reminder: ReminderTime,
    categoryId?: string,
    recurrence?: RecurrenceType
  ) => {
    addTask(title, desc, due, priority, reminder, categoryId, recurrence);
    setPreselectedDate(null);
  }, [addTask]);

  const handleAddTaskFromCalendar = useCallback((date: Date) => {
    setPreselectedDate(format(date, 'yyyy-MM-dd'));
    setIsFormExpanded(true);
  }, []);

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

  const handleToggleForm = useCallback(() => {
    setIsFormExpanded(prev => !prev);
    if (isFormExpanded) {
      setPreselectedDate(null);
    }
  }, [isFormExpanded]);

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
        setPreselectedDate(null);
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

        {/* View Toggle */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center rounded-xl bg-muted p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all',
                viewMode === 'list'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all',
                viewMode === 'weekly'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Week</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all',
                viewMode === 'calendar'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Month</span>
            </button>
            <button
              onClick={() => setViewMode('diary')}
              className={cn(
                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all',
                viewMode === 'diary'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Diary</span>
            </button>
          </div>
        </div>

        <TaskForm
          onSubmit={handleAddTask}
          isExpanded={isFormExpanded}
          onToggleExpand={handleToggleForm}
          preselectedDate={preselectedDate}
        />

        {viewMode === 'diary' ? (
          <DiaryView />
        ) : viewMode === 'list' ? (
          <>
            <TaskForm
              onSubmit={handleAddTask}
              isExpanded={isFormExpanded}
              onToggleExpand={handleToggleForm}
              preselectedDate={preselectedDate}
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
          </>
        ) : viewMode === 'weekly' ? (
          <>
            <TaskForm
              onSubmit={handleAddTask}
              isExpanded={isFormExpanded}
              onToggleExpand={handleToggleForm}
              preselectedDate={preselectedDate}
            />
            <WeeklyAgendaView
              tasks={tasks}
              onTaskClick={handleEditTask}
              onAddTask={handleAddTaskFromCalendar}
            />
          </>
        ) : (
          <>
            <TaskForm
              onSubmit={handleAddTask}
              isExpanded={isFormExpanded}
              onToggleExpand={handleToggleForm}
              preselectedDate={preselectedDate}
            />
            <CalendarView
              tasks={tasks}
              onTaskClick={handleEditTask}
              onAddTask={handleAddTaskFromCalendar}
            />
          </>
        )}

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
