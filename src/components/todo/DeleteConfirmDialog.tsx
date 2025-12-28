import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog = memo(function DeleteConfirmDialog({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 top-1/2 z-50 w-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 -translate-y-1/2"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <div className="rounded-2xl bg-card border border-border shadow-xl p-5 sm:p-6">
              {/* Close button */}
              <button
                onClick={onCancel}
                className="absolute top-3 right-3 btn-ghost"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>

              {/* Content */}
              <h2
                id="delete-dialog-title"
                className="text-lg font-semibold text-foreground text-center mb-2"
              >
                Delete Task?
              </h2>
              <p
                id="delete-dialog-description"
                className="text-sm text-muted-foreground text-center mb-6"
              >
                Are you sure you want to delete{' '}
                <span className="font-medium text-foreground">"{taskTitle}"</span>?
                This action cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-destructive text-destructive-foreground hover:opacity-90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
