import React, { memo, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDiary } from '@/hooks/useDiary';
import { DiaryLockScreen } from './DiaryLockScreen';
import { PageFlipAnimation } from './PageFlipAnimation';
import { DiaryPage } from './DiaryPage';
import { DiarySettings } from './DiarySettings';
import { DiarySearch } from './DiarySearch';
import { DiaryMood } from '@/types/diary';

interface DiaryViewProps {
  onBack?: () => void;
}

type DiaryState = 'locked' | 'animating' | 'open';

export const DiaryView = memo(function DiaryView({ onBack }: DiaryViewProps) {
  const {
    isSetup,
    isUnlocked,
    isLoading,
    error,
    currentEntry,
    currentDate,
    entries,
    settings,
    setupPin,
    unlock,
    lock,
    setCurrentDate,
    updateEntry,
    getAllEntryDates,
    setBookmark,
    getBookmarkedDate,
    updateAutoLock,
  } = useDiary();

  const [diaryState, setDiaryState] = useState<DiaryState>('locked');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Get first entry date for animation
  const entryDates = getAllEntryDates();
  const firstEntryDate = entryDates.length > 0 ? entryDates[0] : null;

  // Handle successful unlock
  const handleUnlock = useCallback(async (pin: string) => {
    const success = await unlock(pin);
    if (success) {
      setDiaryState('animating');
    }
    return success;
  }, [unlock]);

  // Handle setup
  const handleSetup = useCallback(async (pin: string) => {
    await setupPin(pin);
    setDiaryState('open'); // Skip animation for new diary
  }, [setupPin]);

  // Handle animation complete
  const handleAnimationComplete = useCallback(() => {
    setDiaryState('open');
  }, []);

  // Handle lock
  const handleLock = useCallback(() => {
    lock();
    setDiaryState('locked');
  }, [lock]);

  // Handle content change
  const handleContentChange = useCallback((content: string, mood?: DiaryMood) => {
    updateEntry(content, mood);
  }, [updateEntry]);

  // Handle bookmark
  const handleSetBookmark = useCallback((date: string) => {
    setBookmark(date);
  }, [setBookmark]);

  // Handle search select
  const handleSearchSelect = useCallback((date: string) => {
    setCurrentDate(date);
    setIsSearchOpen(false);
  }, [setCurrentDate]);

  // Reset state when unlocked changes
  React.useEffect(() => {
    if (!isUnlocked && diaryState !== 'locked') {
      setDiaryState('locked');
    }
  }, [isUnlocked, diaryState]);

  return (
    <div className="min-h-[500px]">
      <AnimatePresence mode="wait">
        {diaryState === 'locked' && (
          <DiaryLockScreen
            key="lock"
            isSetup={isSetup}
            isLoading={isLoading}
            error={error}
            onSetupPin={handleSetup}
            onUnlock={handleUnlock}
          />
        )}

        {diaryState === 'animating' && (
          <PageFlipAnimation
            key="animation"
            startDate={firstEntryDate}
            endDate={currentDate}
            onComplete={handleAnimationComplete}
          />
        )}

        {diaryState === 'open' && (
          <DiaryPage
            key="page"
            currentDate={currentDate}
            entry={currentEntry}
            entries={entries}
            entryDates={entryDates}
            bookmarkedDate={getBookmarkedDate()}
            onDateChange={setCurrentDate}
            onContentChange={handleContentChange}
            onSetBookmark={handleSetBookmark}
            onLock={handleLock}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <DiarySettings
            isOpen={isSettingsOpen}
            autoLockMinutes={settings?.autoLockMinutes || 5}
            onClose={() => setIsSettingsOpen(false)}
            onAutoLockChange={updateAutoLock}
          />
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <DiarySearch
            entries={entries}
            onSelectEntry={handleSearchSelect}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
});
