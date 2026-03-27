import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RoutineBlock, LiveRoutineState } from '@/types/routine';

const STORAGE_KEY = 'bloomscheduler_routines';
const LIVE_STATE_KEY = 'bloomscheduler_live_routine';

function loadBlocks(): RoutineBlock[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveBlocks(blocks: RoutineBlock[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
}

function loadLiveState(): LiveRoutineState {
  try {
    const saved = localStorage.getItem(LIVE_STATE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { isActive: false, currentBlockIndex: 0, startedAt: null, blockStartedAt: null, pausedAt: null, skippedBlocks: [] };
}

function saveLiveState(state: LiveRoutineState) {
  localStorage.setItem(LIVE_STATE_KEY, JSON.stringify(state));
}

export function useRoutine() {
  const [blocks, setBlocks] = useState<RoutineBlock[]>(loadBlocks);
  const [liveState, setLiveState] = useState<LiveRoutineState>(loadLiveState);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist blocks
  useEffect(() => { saveBlocks(blocks); }, [blocks]);
  useEffect(() => { saveLiveState(liveState); }, [liveState]);

  // Timer for live mode
  useEffect(() => {
    if (liveState.isActive && liveState.blockStartedAt && !liveState.pausedAt) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - liveState.blockStartedAt!) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [liveState.isActive, liveState.blockStartedAt, liveState.pausedAt]);

  // Send browser notification
  const notify = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/placeholder.svg' });
    }
  }, []);

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const addBlock = useCallback((block: Omit<RoutineBlock, 'id' | 'order'>) => {
    setBlocks(prev => [...prev, { ...block, id: uuidv4(), order: prev.length }]);
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<RoutineBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id).map((b, i) => ({ ...b, order: i })));
  }, []);

  const reorderBlocks = useCallback((reordered: RoutineBlock[]) => {
    setBlocks(reordered.map((b, i) => ({ ...b, order: i })));
  }, []);

  // Compute calculated start times for sequential blocks
  const getCalculatedTimeline = useCallback((dayStartTime?: string) => {
    const start = dayStartTime || '08:00';
    const [startH, startM] = start.split(':').map(Number);
    let cursor = startH * 60 + startM;
    return sortedBlocks.map(block => {
      const blockStart = block.flowMode === 'fixed' && block.startTime
        ? (() => { const [h, m] = block.startTime.split(':').map(Number); return h * 60 + m; })()
        : cursor;
      const end = blockStart + block.duration;
      cursor = end;
      return { ...block, calculatedStart: blockStart, calculatedEnd: end };
    });
  }, [sortedBlocks]);

  // Live mode
  const startDay = useCallback(() => {
    if (sortedBlocks.length === 0) return;
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    const now = Date.now();
    const currentBlock = sortedBlocks[0];
    if (currentBlock?.reminderStart) {
      notify('Routine Started', `Starting: ${currentBlock.title}`);
    }
    setLiveState({ isActive: true, currentBlockIndex: 0, startedAt: now, blockStartedAt: now, pausedAt: null, skippedBlocks: [] });
    setElapsed(0);
  }, [sortedBlocks, notify]);

  const nextBlock = useCallback(() => {
    const nextIdx = liveState.currentBlockIndex + 1;
    const currentBlock = sortedBlocks[liveState.currentBlockIndex];
    if (currentBlock?.reminderEnd) {
      notify('Block Complete', `Finished: ${currentBlock.title}`);
    }
    if (nextIdx >= sortedBlocks.length) {
      notify('Routine Complete', 'You completed your daily routine!');
      setLiveState({ isActive: false, currentBlockIndex: 0, startedAt: null, blockStartedAt: null, pausedAt: null, skippedBlocks: [] });
      setElapsed(0);
      return;
    }
    const next = sortedBlocks[nextIdx];
    if (next?.reminderStart) {
      notify('Next Block', `Starting: ${next.title}`);
    }
    setLiveState(prev => ({ ...prev, currentBlockIndex: nextIdx, blockStartedAt: Date.now() }));
    setElapsed(0);
  }, [liveState.currentBlockIndex, sortedBlocks, notify]);

  const skipBlock = useCallback(() => {
    setLiveState(prev => ({
      ...prev,
      skippedBlocks: [...prev.skippedBlocks, sortedBlocks[prev.currentBlockIndex]?.id || ''],
    }));
    nextBlock();
  }, [nextBlock, sortedBlocks, liveState]);

  const stopDay = useCallback(() => {
    setLiveState({ isActive: false, currentBlockIndex: 0, startedAt: null, blockStartedAt: null, pausedAt: null, skippedBlocks: [] });
    setElapsed(0);
  }, []);

  const currentBlock = liveState.isActive ? sortedBlocks[liveState.currentBlockIndex] : null;
  const nextBlockData = liveState.isActive ? sortedBlocks[liveState.currentBlockIndex + 1] : null;

  return {
    blocks: sortedBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    getCalculatedTimeline,
    liveState,
    elapsed,
    currentBlock,
    nextBlockData,
    startDay,
    nextBlock,
    skipBlock,
    stopDay,
  };
}
