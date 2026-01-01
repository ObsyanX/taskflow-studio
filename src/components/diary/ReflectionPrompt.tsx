import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReflectionPromptProps {
  onUsePrompt: (prompt: string) => void;
  onDismiss: () => void;
}

const REFLECTION_PROMPTS = [
  // Gratitude
  "What are three things you're grateful for today?",
  "Who made you smile today and why?",
  "What small moment brought you joy recently?",
  "What's something beautiful you noticed today?",
  
  // Self-reflection
  "How are you really feeling right now?",
  "What's been on your mind lately?",
  "What's one thing you learned about yourself today?",
  "What would you tell your past self from a year ago?",
  
  // Goals & Growth
  "What's one small step you can take toward your dreams?",
  "What challenge did you overcome recently?",
  "What habit are you proud of building?",
  "What's something you want to improve?",
  
  // Mindfulness
  "Describe your current mood in detail.",
  "What sounds, smells, or sensations surrounded you today?",
  "What moment today deserves to be remembered?",
  "If today were a chapter in your life story, what would it be called?",
  
  // Relationships
  "Who do you want to reach out to and why?",
  "What's a conversation that stayed with you today?",
  "How did you show kindness today?",
  "What's something you appreciate about someone close to you?",
  
  // Creativity
  "If you had no limitations, what would you do tomorrow?",
  "What's a dream you've been putting off?",
  "Describe your ideal peaceful day.",
  "What would make tomorrow even better than today?",
];

export const ReflectionPrompt = memo(function ReflectionPrompt({
  onUsePrompt,
  onDismiss,
}: ReflectionPromptProps) {
  const [promptIndex, setPromptIndex] = useState(() => 
    Math.floor(Math.random() * REFLECTION_PROMPTS.length)
  );

  const currentPrompt = REFLECTION_PROMPTS[promptIndex];

  const shufflePrompt = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * REFLECTION_PROMPTS.length);
    } while (newIndex === promptIndex && REFLECTION_PROMPTS.length > 1);
    setPromptIndex(newIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'mb-4 p-4 rounded-xl',
        'bg-primary/5 border border-primary/20',
        'dark:bg-primary/10 dark:border-primary/30'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              Today's Reflection
            </span>
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shufflePrompt}
                className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                title="Different prompt"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary/60" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDismiss}
                className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5 text-primary/60" />
              </motion.button>
            </div>
          </div>
          
          <p className="text-sm text-foreground/80 italic mb-3">
            "{currentPrompt}"
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onUsePrompt(currentPrompt)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium',
              'bg-primary/10 text-primary hover:bg-primary/20',
              'transition-colors'
            )}
          >
            Start writing with this prompt
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});
