import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete, Eye, EyeOff, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiaryLockScreenProps {
  isSetup: boolean;
  isLoading: boolean;
  error: string | null;
  onSetupPin: (pin: string) => Promise<void>;
  onUnlock: (pin: string) => Promise<boolean>;
}

export const DiaryLockScreen = memo(function DiaryLockScreen({
  isSetup,
  isLoading,
  error,
  onSetupPin,
  onUnlock,
}: DiaryLockScreenProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayError = error || localError;

  useEffect(() => {
    inputRef.current?.focus();
  }, [isConfirming]);

  const handleNumberClick = useCallback((num: string) => {
    if (isConfirming) {
      if (confirmPin.length < 6) {
        setConfirmPin(prev => prev + num);
        setLocalError(null);
      }
    } else {
      if (pin.length < 6) {
        setPin(prev => prev + num);
        setLocalError(null);
      }
    }
  }, [pin.length, confirmPin.length, isConfirming]);

  const handleDelete = useCallback(() => {
    if (isConfirming) {
      setConfirmPin(prev => prev.slice(0, -1));
    } else {
      setPin(prev => prev.slice(0, -1));
    }
    setLocalError(null);
  }, [isConfirming]);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (pin.length < 4) {
      setLocalError('PIN must be at least 4 digits');
      triggerShake();
      return;
    }

    if (!isSetup) {
      if (!isConfirming) {
        setIsConfirming(true);
        return;
      }

      if (pin !== confirmPin) {
        setLocalError('PINs do not match');
        setConfirmPin('');
        triggerShake();
        return;
      }

      await onSetupPin(pin);
    } else {
      const success = await onUnlock(pin);
      if (!success) {
        setPin('');
        triggerShake();
      }
    }
  }, [pin, confirmPin, isSetup, isConfirming, onSetupPin, onUnlock, triggerShake]);

  // Auto-submit when PIN is complete
  useEffect(() => {
    if (isSetup && pin.length === 6) {
      handleSubmit();
    }
  }, [pin.length, isSetup, handleSubmit]);

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-4"
    >
      {/* Diary Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 flex items-center justify-center shadow-lg">
            <BookOpen className="w-10 h-10 text-amber-700 dark:text-amber-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Lock className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-semibold text-foreground mb-2"
      >
        {!isSetup 
          ? (isConfirming ? 'Confirm Your PIN' : 'Create Your PIN')
          : 'Enter Your PIN'
        }
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-muted-foreground text-sm mb-8 text-center max-w-xs"
      >
        {!isSetup
          ? (isConfirming 
              ? 'Please re-enter your PIN to confirm' 
              : 'Your diary will be encrypted with this PIN. Choose wisely – it cannot be recovered if forgotten.')
          : 'Your private diary awaits'}
      </motion.p>

      {/* PIN Dots */}
      <motion.div
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex gap-3 mb-8"
      >
        {[...Array(6)].map((_, i) => {
          const currentPin = isConfirming ? confirmPin : pin;
          const isFilled = i < currentPin.length;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: isFilled ? 1.1 : 1, 
                opacity: 1,
              }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={cn(
                'w-4 h-4 rounded-full transition-all duration-200',
                isFilled 
                  ? 'bg-primary shadow-sm shadow-primary/50' 
                  : 'bg-muted border-2 border-border'
              )}
            />
          );
        })}
      </motion.div>

      {/* Toggle PIN visibility */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setShowPin(!showPin)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {showPin ? 'Hide' : 'Show'} PIN
      </motion.button>

      {showPin && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-mono tracking-widest mb-6 text-foreground"
        >
          {isConfirming ? confirmPin || '------' : pin || '------'}
        </motion.div>
      )}

      {/* Error */}
      <AnimatePresence mode="wait">
        {displayError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-destructive text-sm mb-4"
          >
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Number Pad */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {numbers.map((num, i) => {
          if (num === '') return <div key={i} />;
          if (num === 'del') {
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="w-16 h-16 rounded-2xl bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <Delete className="w-6 h-6 text-foreground" />
              </motion.button>
            );
          }
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumberClick(num)}
              className="w-16 h-16 rounded-2xl bg-card hover:bg-card/80 border border-border text-2xl font-medium text-foreground transition-colors shadow-sm"
            >
              {num}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={isLoading || (isConfirming ? confirmPin : pin).length < 4}
        className={cn(
          'w-full max-w-[220px] py-3 rounded-xl font-medium transition-all',
          'bg-primary text-primary-foreground hover:opacity-90',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isLoading ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            {isSetup ? 'Unlocking...' : 'Setting up...'}
          </motion.span>
        ) : (
          isSetup ? 'Unlock Diary' : (isConfirming ? 'Confirm & Create' : 'Continue')
        )}
      </motion.button>

      {isConfirming && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setIsConfirming(false);
            setConfirmPin('');
            setLocalError(null);
          }}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Go back
        </motion.button>
      )}

      {!isSetup && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-xs text-muted-foreground text-center max-w-xs"
        >
          ⚠️ If you forget your PIN, your diary entries cannot be recovered. Keep it safe!
        </motion.p>
      )}
    </motion.div>
  );
});
