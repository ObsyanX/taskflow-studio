import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, Save } from 'lucide-react';
import { Task, Priority } from '@/types/task';
import { cn } from '@/lib/utils';

interface EditTaskDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
}

const priorityOptions: Priority[] = ['High', 'Medium', 'Low'];

export const EditTaskDialog = memo(function EditTaskDialog({
  task,
  isOpen,
  onClose,
  onSave,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.desc);
      setDue(task.due || '');
      setPriority(task.priority);
      setError('');
    }
  }, [task]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (task) {
      onSave(task.id, {
        title: title.trim(),
        desc: desc.trim(),
        due: due || null,
        priority,
      });
    }

    onClose();
  }, [title, desc, due, priority, task, onSave, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-task-title"
            onKeyDown={handleKeyDown}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-card border border-border shadow-xl p-6 space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 id="edit-task-title" className="text-xl font-semibold text-foreground">
                  Edit Task
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title Input */}
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-muted-foreground mb-2">
                  Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                  className={cn(
                    'input-modern',
                    error && 'border-destructive focus:border-destructive'
                  )}
                  aria-invalid={!!error}
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-destructive"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="edit-desc" className="block text-sm font-medium text-muted-foreground mb-2">
                  Description
                </label>
                <textarea
                  id="edit-desc"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Add a description..."
                  className="input-modern min-h-[100px] resize-none"
                />
              </div>

              {/* Due Date & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-due" className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </label>
                  <input
                    id="edit-due"
                    type="date"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <Flag className="w-4 h-4" />
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {priorityOptions.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                          priority === p
                            ? p === 'High'
                              ? 'bg-destructive/10 text-destructive ring-2 ring-destructive/30'
                              : p === 'Medium'
                              ? 'bg-warning/10 text-warning ring-2 ring-warning/30'
                              : 'bg-muted text-muted-foreground ring-2 ring-muted-foreground/30'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        )}
                        aria-pressed={priority === p}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
