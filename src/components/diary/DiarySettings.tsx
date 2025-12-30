import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiarySettingsProps {
  isOpen: boolean;
  autoLockMinutes: number;
  onClose: () => void;
  onAutoLockChange: (minutes: number) => void;
}

const autoLockOptions = [
  { value: 0, label: 'Never' },
  { value: 1, label: '1 minute' },
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
];

export const DiarySettings = memo(function DiarySettings({
  isOpen,
  autoLockMinutes,
  onClose,
  onAutoLockChange,
}: DiarySettingsProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Diary Settings</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </motion.button>
        </div>

        {/* Auto-lock setting */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">
              Auto-lock after inactivity
            </label>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {autoLockOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAutoLockChange(option.value)}
                className={cn(
                  'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  autoLockMinutes === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Security info */}
        <div className="p-4 rounded-xl bg-muted/50 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-foreground mb-1">
                Your diary is encrypted
              </h3>
              <p className="text-xs text-muted-foreground">
                All entries are encrypted with AES-256 using your PIN. 
                Your data stays private and secure on your device.
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-destructive mb-1">
                PIN Recovery
              </h3>
              <p className="text-xs text-destructive/80">
                If you forget your PIN, your diary entries cannot be recovered. 
                There is no reset option for security reasons.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
