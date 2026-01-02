export type DiaryMood = 'happy' | 'neutral' | 'sad' | 'excited' | 'anxious' | 'grateful';

export interface DiaryImage {
  id: string;
  data: string; // base64 data URL
  caption?: string;
  addedAt: string;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  content: string;
  mood?: DiaryMood;
  images?: DiaryImage[];
  createdAt: string;
  updatedAt: string;
}

export interface DiarySettings {
  pinHash: string; // SHA-256 hash of the PIN for verification
  salt: string; // Salt for encryption key derivation
  autoLockMinutes: number; // 0 = never, 1, 5, 15
  lastOpenedDate: string | null;
  bookmarkedDate: string | null;
}

export interface EncryptedDiaryData {
  entries: string; // Encrypted JSON string of DiaryEntry[]
  iv: string; // Initialization vector for AES-GCM
}

export const MOOD_EMOJI: Record<DiaryMood, string> = {
  happy: '😊',
  neutral: '😐',
  sad: '😢',
  excited: '🤩',
  anxious: '😰',
  grateful: '🙏',
};

export const MOOD_LABELS: Record<DiaryMood, string> = {
  happy: 'Happy',
  neutral: 'Neutral',
  sad: 'Sad',
  excited: 'Excited',
  anxious: 'Anxious',
  grateful: 'Grateful',
};
