export type BlockType = 'work' | 'meal' | 'health' | 'study' | 'custom';
export type FlowMode = 'sequential' | 'fixed';
export type RepeatMode = 'daily' | 'weekly';

export interface RoutineBlock {
  id: string;
  title: string;
  type: BlockType;
  duration: number; // minutes
  startTime?: string; // HH:mm format
  order: number;
  flowMode: FlowMode;
  reminderStart: boolean;
  reminderEnd: boolean;
  repeat: RepeatMode;
  repeatDays?: string[];
}

export interface LiveRoutineState {
  isActive: boolean;
  currentBlockIndex: number;
  startedAt: number | null; // timestamp
  blockStartedAt: number | null;
  pausedAt: number | null;
  skippedBlocks: string[];
}
