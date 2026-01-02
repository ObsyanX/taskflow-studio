import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { format, parseISO, addDays, subDays, isToday, getMonth, getDate } from 'date-fns';
import { Save, Lock, Settings, ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DiaryEntry, DiaryMood, DiaryImage } from '@/types/diary';
import { MoodSelector } from './MoodSelector';
import { RibbonBookmark } from './RibbonBookmark';
import { DiaryDateNav } from './DiaryDateNav';
import { DiaryFontSelector, DiaryFont, DIARY_FONTS } from './DiaryFontSelector';
import { DiaryEditor } from './DiaryEditor';
import { DiaryToolbar } from './DiaryToolbar';
import { ReflectionPrompt } from './ReflectionPrompt';
import { OnThisDay } from './OnThisDay';
import { usePageFlipSound } from '@/hooks/usePageFlipSound';

interface DiaryPageProps {
  currentDate: string;
  entry: DiaryEntry | null;
  entries: DiaryEntry[];
  entryDates: string[];
  bookmarkedDate: string | null;
  onDateChange: (date: string) => void;
  onContentChange: (content: string, mood?: DiaryMood, images?: DiaryImage[]) => void;
  onSetBookmark: (date: string | null) => void;
  onLock: () => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
}

// Default to a beautiful handwriting font
const DEFAULT_FONT = DIARY_FONTS.find(f => f.name === 'Dancing Script') || DIARY_FONTS[0];
const FONT_STORAGE_KEY = 'diary-selected-font';
const FONT_SIZE_STORAGE_KEY = 'diary-font-size';
const PROMPT_DISMISSED_KEY = 'diary-prompt-dismissed';

export const DiaryPage = memo(function DiaryPage({
  currentDate,
  entry,
  entries,
  entryDates,
  bookmarkedDate,
  onDateChange,
  onContentChange,
  onSetBookmark,
  onLock,
  onOpenSettings,
  onOpenSearch,
}: DiaryPageProps) {
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState<DiaryMood | undefined>(entry?.mood);
  const [images, setImages] = useState<DiaryImage[]>(entry?.images || []);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showReflectionPrompt, setShowReflectionPrompt] = useState(false);
  const [showOnThisDay, setShowOnThisDay] = useState(true);
  const [selectedFont, setSelectedFont] = useState<DiaryFont>(() => {
    try {
      const saved = localStorage.getItem(FONT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = DIARY_FONTS.find(f => f.name === parsed.name);
        if (found) return found;
      }
    } catch {}
    return DEFAULT_FONT;
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 19;
  });
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playPageFlip } = usePageFlipSound();

  const current = parseISO(currentDate);
  const isCurrentToday = isToday(current);

  // Show reflection prompt for new entries on today's date
  useEffect(() => {
    if (isCurrentToday && !entry?.content) {
      const dismissed = sessionStorage.getItem(PROMPT_DISMISSED_KEY);
      if (!dismissed) {
        setShowReflectionPrompt(true);
      }
    } else {
      setShowReflectionPrompt(false);
    }
  }, [isCurrentToday, entry?.content]);

  // Update local state when entry changes
  useEffect(() => {
    setContent(entry?.content || '');
    setMood(entry?.mood);
    setImages(entry?.images || []);
  }, [entry, currentDate]);

  // Auto-save with debouncing
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setIsSaving(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      onContentChange(newContent, mood, images);
      setIsSaving(false);
      setLastSaved(new Date());
    }, 800);
  }, [mood, images, onContentChange]);

  // Handle images change
  const handleImagesChange = useCallback((newImages: DiaryImage[]) => {
    setImages(newImages);
    onContentChange(content, mood, newImages);
    setLastSaved(new Date());
  }, [content, mood, onContentChange]);

  // Handle mood change
  const handleMoodChange = useCallback((newMood: DiaryMood) => {
    setMood(newMood);
    onContentChange(content, newMood, images);
    setLastSaved(new Date());
  }, [content, images, onContentChange]);

  // Handle font change
  const handleFontChange = useCallback((font: DiaryFont) => {
    setSelectedFont(font);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, JSON.stringify({ name: font.name }));
    } catch {}
  }, []);

  // Handle font size change
  const handleFontSizeChange = useCallback((size: number) => {
    setFontSize(size);
    try {
      localStorage.setItem(FONT_SIZE_STORAGE_KEY, size.toString());
    } catch {}
  }, []);

  // Handle reflection prompt use
  const handleUsePrompt = useCallback((prompt: string) => {
    const promptText = `<strong>${prompt}</strong><br><br>`;
    setContent(promptText);
    onContentChange(promptText, mood, images);
    setShowReflectionPrompt(false);
    sessionStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
  }, [mood, images, onContentChange]);

  // Dismiss reflection prompt
  const handleDismissPrompt = useCallback(() => {
    setShowReflectionPrompt(false);
    sessionStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
  }, []);

  // Swipe handling for page navigation with sound
  const handleDateChangeWithSound = useCallback((newDate: string) => {
    playPageFlip();
    onDateChange(newDate);
  }, [onDateChange, playPageFlip]);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      handleDateChangeWithSound(format(subDays(current, 1), 'yyyy-MM-dd'));
    } else if (info.offset.x < -swipeThreshold && !isCurrentToday) {
      handleDateChangeWithSound(format(addDays(current, 1), 'yyyy-MM-dd'));
    }
  }, [current, isCurrentToday, handleDateChangeWithSound]);

  const handleJumpToBookmark = useCallback(() => {
    if (bookmarkedDate) {
      playPageFlip();
      onDateChange(bookmarkedDate);
    }
  }, [bookmarkedDate, onDateChange, playPageFlip]);

  const handleSetBookmark = useCallback(() => {
    onSetBookmark(currentDate);
  }, [currentDate, onSetBookmark]);

  const handleRemoveBookmark = useCallback(() => {
    onSetBookmark(null);
  }, [onSetBookmark]);

  // Check if there are memories on this day
  const hasOnThisDayMemories = entries.some((entry) => {
    const current = parseISO(currentDate);
    const entryDate = parseISO(entry.date);
    return (
      getMonth(entryDate) === getMonth(current) &&
      getDate(entryDate) === getDate(current) &&
      entry.date !== currentDate &&
      entry.content.trim().length > 0
    );
  });

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
          onDateChange={handleDateChangeWithSound}
        />

        <div className="flex items-center gap-2">
          {/* On This Day button */}
          {hasOnThisDayMemories && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOnThisDay(!showOnThisDay)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors',
                showOnThisDay
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-card border-border text-muted-foreground hover:bg-muted'
              )}
              title="On This Day memories"
            >
              <Sparkles className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
            title="Search entries"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </motion.button>

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
            onRemoveBookmark={handleRemoveBookmark}
          />

          {/* Page Content */}
          <div className="relative p-6 pt-8">
            {/* Date Header with Toolbar */}
            <div className="mb-4 pl-12 pr-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="font-serif text-xl text-foreground">
                    {format(current, 'EEEE')}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {format(current, 'MMMM d, yyyy')}
                  </p>
                </div>
                <MoodSelector
                  selectedMood={mood}
                  onSelect={handleMoodChange}
                />
              </div>
              
              {/* Combined Toolbar with Photos */}
              <DiaryToolbar
                selectedFont={selectedFont}
                fontSize={fontSize}
                onFontChange={handleFontChange}
                onFontSizeChange={handleFontSizeChange}
                images={images}
                onImagesChange={handleImagesChange}
              />
            </div>

            {/* On This Day Memories */}
            <div className="pl-12 pr-4">
              <OnThisDay
                currentDate={currentDate}
                entries={entries}
                onNavigateToEntry={handleDateChangeWithSound}
                isOpen={showOnThisDay && hasOnThisDayMemories}
                onClose={() => setShowOnThisDay(false)}
              />
            </div>

            {/* Reflection Prompt */}
            <div className="pl-12 pr-4">
              <AnimatePresence>
                {showReflectionPrompt && (
                  <ReflectionPrompt
                    onUsePrompt={handleUsePrompt}
                    onDismiss={handleDismissPrompt}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Writing Area */}
            <div className="pl-12 pr-4">
              <DiaryEditor
                content={content}
                font={selectedFont}
                fontSize={fontSize}
                onChange={handleContentChange}
                placeholder="Dear diary..."
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
