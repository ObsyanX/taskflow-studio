import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar, Flag, Clock } from 'lucide-react';
import { Priority } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  onSubmit: (title: string, desc: string, due: string | null, priority: Priority) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const priorityOptions: Priority[] = ['High', 'Medium', 'Low'];

export const TaskForm = memo(function TaskForm({
  onSubmit,
  isExpanded,
  onToggleExpand,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [error, setError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    // Combine date and time into ISO string
    let dueDateTime: string | null = null;
    if (dueDate) {
      dueDateTime = dueTime ? `${dueDate}T${dueTime}:00` : `${dueDate}T00:00:00`;
    }

    onSubmit(title, desc, dueDateTime, priority);
    
    // Reset form
    setTitle('');
    setDesc('');
    setDueDate('');
    setDueTime('');
    setPriority('Medium');
    setError('');
    onToggleExpand();
  }, [title, desc, dueDate, dueTime, priority, onSubmit, onToggleExpand]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && title.trim()) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      onToggleExpand();
    }
  }, [handleSubmit, title, onToggleExpand]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) setError('');
  }, [error]);

  return (
    <div className="mb-6">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="add-button"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={onToggleExpand}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border-2 border-dashed border-border hover:border-primary/50 hover:bg-card-hover transition-all group"
            aria-label="Add new task"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
              Add a new task...
            </span>
            <span className="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              Press N
            </span>
          </motion.button>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onSubmit={handleSubmit}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-card border border-border shadow-lg space-y-4">
              {/* Title Input */}
              <div>
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="What needs to be done?"
                  className={cn(
                    'input-modern text-lg font-medium',
                    error && 'border-destructive focus:border-destructive'
                  )}
                  aria-label="Task title"
                  aria-invalid={!!error}
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
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Add a description (optional)"
                className="input-modern min-h-[80px] resize-none"
                aria-label="Task description"
              />

              {/* Due Date, Time & Priority */}
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[140px]">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-modern"
                    aria-label="Due date"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    Due Time
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="input-modern"
                    aria-label="Due time"
                    disabled={!dueDate}
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
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
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
});
