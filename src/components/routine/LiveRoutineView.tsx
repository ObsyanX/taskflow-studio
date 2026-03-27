import React from 'react';
import { RoutineBlock } from '@/types/routine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, SkipForward, Square, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

interface Props {
  currentBlock: RoutineBlock | null;
  nextBlock: RoutineBlock | null;
  elapsed: number;
  onNext: () => void;
  onSkip: () => void;
  onStop: () => void;
}

export function LiveRoutineView({ currentBlock, nextBlock, elapsed, onNext, onSkip, onStop }: Props) {
  if (!currentBlock) return null;

  const totalSeconds = currentBlock.duration * 60;
  const remaining = Math.max(0, totalSeconds - elapsed);
  const progress = Math.min(100, (elapsed / totalSeconds) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6 text-center space-y-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Now</p>
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentBlock.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-2xl font-bold"
            >
              {currentBlock.title}
            </motion.h2>
          </AnimatePresence>

          <div className="text-4xl font-mono font-bold tabular-nums text-primary">
            {formatTime(remaining)}
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={onSkip}>
              <SkipForward className="h-4 w-4 mr-1" /> Skip
            </Button>
            <Button onClick={onNext} size="sm">
              <ChevronRight className="h-4 w-4 mr-1" />
              {nextBlock ? 'Next Block' : 'Finish'}
            </Button>
            <Button variant="destructive" size="sm" onClick={onStop}>
              <Square className="h-4 w-4 mr-1" /> Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {nextBlock && (
        <Card className="border-dashed opacity-70">
          <CardContent className="p-4 flex items-center gap-3">
            <Play className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Up next</p>
              <p className="text-sm font-medium">{nextBlock.title}</p>
            </div>
            <span className="ml-auto text-xs text-muted-foreground">{nextBlock.duration}m</span>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
