import React, { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Plus, Keyboard, CheckCircle2 } from 'lucide-react';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskList = memo(function TaskList({
  tasks,
  loading,
  onToggle,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-muted-foreground">Loading tasks...</p>
      </motion.div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-12 px-4"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 shadow-lg"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>

        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-foreground mb-2"
        >
          Welcome to TaskFlow
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-center max-w-sm mb-8 text-sm sm:text-base"
        >
          Your tasks are saved locally on this device. Start by creating your first task below.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-sm space-y-3"
        >
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Create a task</p>
              <p className="text-xs text-muted-foreground">Click "New Task" or press <kbd className="px-1 py-0.5 rounded bg-background text-[10px] font-mono">N</kbd></p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Stay organized</p>
              <p className="text-xs text-muted-foreground">Set priorities and due dates to track progress</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Keyboard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Keyboard shortcuts</p>
              <p className="text-xs text-muted-foreground"><kbd className="px-1 py-0.5 rounded bg-background text-[10px] font-mono">/</kbd> to search, <kbd className="px-1 py-0.5 rounded bg-background text-[10px] font-mono">Esc</kbd> to close</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});
