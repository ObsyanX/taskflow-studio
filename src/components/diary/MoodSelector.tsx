import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { DiaryMood, MOOD_EMOJI, MOOD_LABELS } from '@/types/diary';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  selectedMood?: DiaryMood;
  onSelect: (mood: DiaryMood) => void;
}

const moods: DiaryMood[] = ['happy', 'excited', 'grateful', 'neutral', 'anxious', 'sad'];

export const MoodSelector = memo(function MoodSelector({
  selectedMood,
  onSelect,
}: MoodSelectorProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground mr-2">Mood:</span>
      {moods.map((mood) => (
        <motion.button
          key={mood}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(mood)}
          title={MOOD_LABELS[mood]}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-all text-lg',
            selectedMood === mood
              ? 'bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background'
              : 'hover:bg-muted opacity-60 hover:opacity-100'
          )}
        >
          {MOOD_EMOJI[mood]}
        </motion.button>
      ))}
    </div>
  );
});
