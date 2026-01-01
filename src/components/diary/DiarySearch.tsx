import React, { memo, useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { DiaryEntry, DiaryMood, MOOD_EMOJI, MOOD_LABELS } from '@/types/diary';

interface DiarySearchProps {
  entries: DiaryEntry[];
  onSelectEntry: (date: string) => void;
  onClose: () => void;
}

export const DiarySearch = memo(function DiarySearch({
  entries,
  onSelectEntry,
  onClose,
}: DiarySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<DiaryMood | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter entries based on search query and mood
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesQuery = searchQuery.trim() === '' || 
        entry.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMood = selectedMood === null || entry.mood === selectedMood;
      return matchesQuery && matchesMood;
    }).sort((a, b) => b.date.localeCompare(a.date)); // Most recent first
  }, [entries, searchQuery, selectedMood]);

  const moods: DiaryMood[] = ['happy', 'neutral', 'sad', 'excited', 'anxious', 'grateful'];

  // Strip HTML tags for preview
  const getTextPreview = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.slice(0, 100) + (text.length > 100 ? '...' : '');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Search Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative w-full max-w-lg',
          'bg-card border border-border rounded-2xl shadow-2xl',
          'overflow-hidden'
        )}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search diary entries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-10 py-3 rounded-xl',
                'bg-muted/50 border border-border',
                'text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary/30',
                'transition-all'
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mood Filter */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Filter by mood:</span>
            {moods.map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
                className={cn(
                  'px-2 py-1 rounded-lg text-sm transition-all',
                  selectedMood === mood
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                {MOOD_EMOJI[mood]}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No entries found</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredEntries.map(entry => (
                <motion.button
                  key={entry.id}
                  whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                  onClick={() => {
                    onSelectEntry(entry.date);
                    onClose();
                  }}
                  className={cn(
                    'w-full p-3 rounded-xl text-left transition-colors',
                    'flex items-start gap-3'
                  )}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    {entry.mood ? (
                      <span className="text-lg">{MOOD_EMOJI[entry.mood]}</span>
                    ) : (
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {format(parseISO(entry.date), 'MMMM d, yyyy')}
                      </span>
                      {entry.mood && (
                        <span className="text-xs text-muted-foreground">
                          {MOOD_LABELS[entry.mood]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {getTextPreview(entry.content)}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border text-center">
          <span className="text-xs text-muted-foreground">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} found
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
});
