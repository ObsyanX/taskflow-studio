import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { DiaryEntry, DiarySettings, DiaryMood, DiaryImage, EncryptedDiaryData } from '@/types/diary';
import { encryptData, decryptData, hashPin, generateSalt } from '@/utils/encryption';
import { useLocalStorage } from './useLocalStorage';

const DIARY_SETTINGS_KEY = 'taskflow-diary-settings';
const DIARY_DATA_KEY = 'taskflow-diary-data';

interface UseDiaryReturn {
  // State
  isSetup: boolean;
  isUnlocked: boolean;
  entries: DiaryEntry[];
  currentEntry: DiaryEntry | null;
  currentDate: string;
  settings: DiarySettings | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setupPin: (pin: string) => Promise<void>;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
  setCurrentDate: (date: string) => void;
  updateEntry: (content: string, mood?: DiaryMood, images?: DiaryImage[]) => Promise<void>;
  getEntriesForDate: (date: string) => DiaryEntry | undefined;
  getAllEntryDates: () => string[];
  setBookmark: (date: string | null) => void;
  getBookmarkedDate: () => string | null;
  updateAutoLock: (minutes: number) => void;
}

export function useDiary(): UseDiaryReturn {
  const [settings, setSettings] = useLocalStorage<DiarySettings | null>(DIARY_SETTINGS_KEY, null);
  const [encryptedData, setEncryptedData] = useLocalStorage<EncryptedDiaryData | null>(DIARY_DATA_KEY, null);
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const pinRef = useRef<string | null>(null);
  const autoLockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const isSetup = !!settings?.pinHash;

  // Reset auto-lock timer
  const resetAutoLock = useCallback(() => {
    if (autoLockTimeoutRef.current) {
      clearTimeout(autoLockTimeoutRef.current);
    }
    
    if (settings?.autoLockMinutes && settings.autoLockMinutes > 0 && isUnlocked) {
      autoLockTimeoutRef.current = setTimeout(() => {
        setIsUnlocked(false);
        setEntries([]);
        pinRef.current = null;
      }, settings.autoLockMinutes * 60 * 1000);
    }
  }, [settings?.autoLockMinutes, isUnlocked]);

  // Auto-lock on tab blur
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isUnlocked && settings?.autoLockMinutes && settings.autoLockMinutes > 0) {
        setIsUnlocked(false);
        setEntries([]);
        pinRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isUnlocked, settings?.autoLockMinutes]);

  // Reset auto-lock on activity
  useEffect(() => {
    if (isUnlocked) {
      resetAutoLock();
    }
  }, [isUnlocked, currentDate, resetAutoLock]);

  // Save entries with debouncing
  const saveEntries = useCallback(async (entriesToSave: DiaryEntry[]) => {
    if (!pinRef.current || !settings?.salt) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const dataString = JSON.stringify(entriesToSave);
        const { encrypted, iv } = await encryptData(dataString, pinRef.current!, settings.salt);
        setEncryptedData({ entries: encrypted, iv });
      } catch (err) {
        console.error('Failed to save diary entries:', err);
      }
    }, 500);
  }, [settings?.salt, setEncryptedData]);

  // Setup PIN for first time
  const setupPin = useCallback(async (pin: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const pinHash = await hashPin(pin);
      const salt = generateSalt();
      
      const newSettings: DiarySettings = {
        pinHash,
        salt,
        autoLockMinutes: 5,
        lastOpenedDate: null,
        bookmarkedDate: null,
      };
      
      setSettings(newSettings);
      pinRef.current = pin;
      setIsUnlocked(true);
      setEntries([]);
      
      // Save empty entries
      const { encrypted, iv } = await encryptData('[]', pin, salt);
      setEncryptedData({ entries: encrypted, iv });
    } catch (err) {
      setError('Failed to setup diary. Please try again.');
      console.error('Setup error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setSettings, setEncryptedData]);

  // Unlock diary with PIN
  const unlock = useCallback(async (pin: string): Promise<boolean> => {
    if (!settings) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const pinHash = await hashPin(pin);
      
      if (pinHash !== settings.pinHash) {
        setError('Incorrect PIN');
        setIsLoading(false);
        return false;
      }
      
      pinRef.current = pin;
      
      // Decrypt entries
      if (encryptedData) {
        const decrypted = await decryptData(
          encryptedData.entries,
          encryptedData.iv,
          pin,
          settings.salt
        );
        setEntries(JSON.parse(decrypted));
      } else {
        setEntries([]);
      }
      
      // Update last opened date
      setSettings({
        ...settings,
        lastOpenedDate: format(new Date(), 'yyyy-MM-dd'),
      });
      
      setIsUnlocked(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Failed to unlock diary. Please try again.');
      console.error('Unlock error:', err);
      setIsLoading(false);
      return false;
    }
  }, [settings, encryptedData, setSettings]);

  // Lock diary
  const lock = useCallback(() => {
    setIsUnlocked(false);
    setEntries([]);
    pinRef.current = null;
    if (autoLockTimeoutRef.current) {
      clearTimeout(autoLockTimeoutRef.current);
    }
  }, []);

  // Get current entry
  const currentEntry = entries.find(e => e.date === currentDate) || null;

  // Update entry for current date
  const updateEntry = useCallback(async (content: string, mood?: DiaryMood, images?: DiaryImage[]) => {
    resetAutoLock();
    
    setEntries(prev => {
      const existingIndex = prev.findIndex(e => e.date === currentDate);
      const now = new Date().toISOString();
      
      let updated: DiaryEntry[];
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          content,
          mood: mood ?? updated[existingIndex].mood,
          images: images ?? updated[existingIndex].images,
          updatedAt: now,
        };
      } else {
        const newEntry: DiaryEntry = {
          id: uuidv4(),
          date: currentDate,
          content,
          mood,
          images,
          createdAt: now,
          updatedAt: now,
        };
        updated = [...prev, newEntry];
      }
      
      saveEntries(updated);
      return updated;
    });
  }, [currentDate, saveEntries, resetAutoLock]);

  // Get entry for specific date
  const getEntriesForDate = useCallback((date: string) => {
    return entries.find(e => e.date === date);
  }, [entries]);

  // Get all dates with entries
  const getAllEntryDates = useCallback(() => {
    return entries.map(e => e.date).sort();
  }, [entries]);

  // Set bookmark
  const setBookmark = useCallback((date: string | null) => {
    if (settings) {
      setSettings({
        ...settings,
        bookmarkedDate: date,
      });
    }
  }, [settings, setSettings]);

  // Get bookmarked date
  const getBookmarkedDate = useCallback(() => {
    return settings?.bookmarkedDate || null;
  }, [settings]);

  // Update auto-lock setting
  const updateAutoLock = useCallback((minutes: number) => {
    if (settings) {
      setSettings({
        ...settings,
        autoLockMinutes: minutes,
      });
    }
  }, [settings, setSettings]);

  return {
    isSetup,
    isUnlocked,
    entries,
    currentEntry,
    currentDate,
    settings,
    isLoading,
    error,
    setupPin,
    unlock,
    lock,
    setCurrentDate,
    updateEntry,
    getEntriesForDate,
    getAllEntryDates,
    setBookmark,
    getBookmarkedDate,
    updateAutoLock,
  };
}
