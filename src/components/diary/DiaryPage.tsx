import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { format, parseISO, addDays, subDays, isToday } from 'date-fns';
import { Save, Lock, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DiaryEntry, DiaryMood } from '@/types/diary';
import { MoodSelector } from './MoodSelector';
import { RibbonBookmark } from './RibbonBookmark';
import { DiaryDateNav } from './DiaryDateNav';

interface DiaryPageProps {
  currentDate: string;
  entry: DiaryEntry | null;
  entryDates: string[];
  bookmarkedDate: string | null;
  onDateChange: (date: string) => void;
  onContentChange: (content: string, mood?: DiaryMood) => void;
  onSetBookmark: (date: string) => void;
  onLock: () => void;
  onOpenSettings: () => void;
}

export const DiaryPage = memo(function DiaryPage({
  currentDate,
  entry,
  entryDates,
  bookmarkedDate,
  onDateChange,
  onContentChange,
  onSetBookmark,
  onLock,
  onOpenSettings,
}: DiaryPageProps) {
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState<DiaryMood | undefined>(entry?.mood);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const current = parseISO(currentDate);
  const isCurrentToday = isToday(current);

  // Update local state when entry changes
  useEffect(() => {
    setContent(entry?.content || '');
    setMood(entry?.mood);
  }, [entry, currentDate]);

  // Auto-save with debouncing
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setIsSaving(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      onContentChange(newContent, mood);
      setIsSaving(false);
      setLastSaved(new Date());
    }, 800);
  }, [mood, onContentChange]);

  // Handle mood change
  const handleMoodChange = useCallback((newMood: DiaryMood) => {
    setMood(newMood);
    onContentChange(content, newMood);
    setLastSaved(new Date());
  }, [content, onContentChange]);

  // Swipe handling for page navigation
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      // Swipe right = previous day
      onDateChange(format(subDays(current, 1), 'yyyy-MM-dd'));
    } else if (info.offset.x < -swipeThreshold && !isCurrentToday) {
      // Swipe left = next day
      onDateChange(format(addDays(current, 1), 'yyyy-MM-dd'));
    }
  }, [current, isCurrentToday, onDateChange]);

  const handleJumpToBookmark = useCallback(() => {
    if (bookmarkedDate) {
      onDateChange(bookmarkedDate);
    }
  }, [bookmarkedDate, onDateChange]);

  const handleSetBookmark = useCallback(() => {
    onSetBookmark(currentDate);
  }, [currentDate, onSetBookmark]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <DiaryDateNav
          currentDate={currentDate}
          entryDates={entryDates}
          onDateChange={onDateChange}
        />

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLock}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            title="Lock diary"
          >
            <Lock className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Diary Page */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="relative"
      >
        <div 
          className={cn(
            'relative rounded-2xl shadow-xl overflow-hidden',
            'bg-gradient-to-br from-amber-50 to-amber-100/80',
            'dark:from-amber-950/40 dark:to-amber-900/20',
            'border border-amber-200/50 dark:border-amber-800/30'
          )}
          style={{
            minHeight: '500px',
          }}
        >
          {/* Paper texture overlay */}
          <div 
            className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Horizontal lines */}
          <div className="absolute inset-0 pointer-events-none" style={{ top: '80px' }}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-full h-px bg-amber-900/10 dark:bg-amber-100/10"
                style={{ marginTop: '28px' }}
              />
            ))}
          </div>

          {/* Red margin line */}
          <div className="absolute top-0 bottom-0 left-16 w-px bg-red-400/40 dark:bg-red-400/20" />

          {/* Ribbon Bookmark */}
          <RibbonBookmark
            bookmarkedDate={bookmarkedDate}
            currentDate={currentDate}
            onJumpToBookmark={handleJumpToBookmark}
            onSetBookmark={handleSetBookmark}
          />

          {/* Page Content */}
          <div className="relative p-6 pt-8">
            {/* Date Header */}
            <div className="mb-6 pl-12">
              <h2 className="font-serif text-xl text-foreground">
                {format(current, 'EEEE')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(current, 'MMMM d, yyyy')}
              </p>
            </div>

            {/* Mood Selector */}
            <div className="mb-4 pl-12">
              <MoodSelector
                selectedMood={mood}
                onSelect={handleMoodChange}
              />
            </div>

            {/* Writing Area */}
            <div className="pl-12 pr-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Dear diary..."
                className={cn(
                  'w-full min-h-[350px] resize-none',
                  'bg-transparent border-none outline-none',
                  'text-foreground placeholder:text-muted-foreground/50',
                  'font-serif text-lg leading-[28px]',
                  'focus:ring-0 focus:outline-none'
                )}
                style={{
                  lineHeight: '28px',
                }}
              />
            </div>

            {/* Save Status */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-muted-foreground">
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.span
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Save className="w-3 h-3 animate-pulse" />
                    Saving...
                  </motion.span>
                ) : lastSaved ? (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    Saved
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          {/* Page curl effect */}
          <div 
            className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.05) 50%)',
            }}
          />
        </div>

        {/* Swipe hints */}
        <div className="flex items-center justify-between mt-4 px-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span>Previous day</span>
          </div>
          {!isCurrentToday && (
            <div className="flex items-center gap-1">
              <span>Next day</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});
