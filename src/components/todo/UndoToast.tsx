import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, X } from 'lucide-react';
import { Task } from '@/types/task';

interface UndoToastProps {
  deletedTask: Task | null;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export const UndoToast = memo(function UndoToast({
  deletedTask,
  onUndo,
  onDismiss,
  duration = 5000,
}: UndoToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!deletedTask) {
      setProgress(100);
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;
      setProgress(newProgress);

      if (newProgress > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [deletedTask, duration, onDismiss]);

  return (
    <AnimatePresence>
      {deletedTask && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="relative overflow-hidden rounded-xl bg-foreground text-background shadow-2xl">
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/10">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="flex items-center gap-3 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  Deleted "{deletedTask.title}"
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onUndo}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo
                </button>
                <button
                  onClick={onDismiss}
                  className="p-1.5 rounded-lg hover:bg-background/10 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
