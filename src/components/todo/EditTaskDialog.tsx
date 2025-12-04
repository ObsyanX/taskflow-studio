import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, Save, Clock } from 'lucide-react';
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
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.desc);
      // Parse existing due datetime
      if (task.due) {
        const date = new Date(task.due);
        setDueDate(date.toISOString().split('T')[0]);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        if (hours !== 0 || minutes !== 0) {
          setDueTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        } else {
          setDueTime('');
        }
      } else {
        setDueDate('');
        setDueTime('');
      }
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

    // Combine date and time into ISO string
    let dueDateTime: string | null = null;
    if (dueDate) {
      dueDateTime = dueTime ? `${dueDate}T${dueTime}:00` : `${dueDate}T00:00:00`;
    }

    if (task) {
      onSave(task.id, {
        title: title.trim(),
        desc: desc.trim(),
        due: dueDateTime,
        priority,
      });
    }

    onClose();
  }, [title, desc, dueDate, dueTime, priority, task, onSave, onClose]);

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
            className="fixed inset-x-3 sm:inset-x-auto sm:left-1/2 top-1/2 z-50 w-auto sm:w-full sm:max-w-lg sm:-translate-x-1/2 -translate-y-1/2"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-task-title"
            onKeyDown={handleKeyDown}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-card border border-border shadow-xl p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 id="edit-task-title" className="text-lg sm:text-xl font-semibold text-foreground">
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
                  className="input-modern min-h-[80px] sm:min-h-[100px] resize-none"
                />
              </div>

              {/* Due Date & Time */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="edit-due-date" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Due Date
                  </label>
                  <input
                    id="edit-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-modern text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-due-time" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Due Time
                  </label>
                  <input
                    id="edit-due-time"
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="input-modern text-sm"
                    disabled={!dueDate}
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                  <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {priorityOptions.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        'px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all',
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

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto"
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
