import React, { useState } from 'react';
import { useRoutine } from '@/hooks/useRoutine';
import { RoutineBlock } from '@/types/routine';
import { RoutineBlockCard } from '@/components/routine/RoutineBlockCard';
import { RoutineModal } from '@/components/routine/RoutineModal';
import { LiveRoutineView } from '@/components/routine/LiveRoutineView';
import { Button } from '@/components/ui/button';
import { Plus, Play, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Routine() {
  const {
    blocks, addBlock, updateBlock, deleteBlock,
    getCalculatedTimeline, liveState, elapsed,
    currentBlock, nextBlockData, startDay, nextBlock, skipBlock, stopDay,
  } = useRoutine();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<RoutineBlock | null>(null);

  const timeline = getCalculatedTimeline();

  const handleSave = (data: Omit<RoutineBlock, 'id' | 'order'> | Partial<RoutineBlock>) => {
    if ('id' in data && data.id) {
      updateBlock(data.id, data);
    } else {
      addBlock(data as Omit<RoutineBlock, 'id' | 'order'>);
    }
  };

  const handleEdit = (block: RoutineBlock) => {
    setEditingBlock(block);
    setModalOpen(true);
  };

  const totalMinutes = blocks.reduce((s, b) => s + b.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainMins = totalMinutes % 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Routine</h1>
          <p className="text-sm text-muted-foreground">Design your daily flow</p>
        </div>
        <div className="flex items-center gap-2">
          {blocks.length > 0 && !liveState.isActive && (
            <Button onClick={startDay} variant="default" size="sm">
              <Play className="h-4 w-4 mr-1" /> Start Day
            </Button>
          )}
          <Button onClick={() => { setEditingBlock(null); setModalOpen(true); }} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" /> Add Block
          </Button>
        </div>
      </div>

      {/* Summary */}
      {blocks.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{blocks.length} blocks · {totalHours > 0 ? `${totalHours}h ` : ''}{remainMins > 0 ? `${remainMins}m` : ''}</span>
        </div>
      )}

      {/* Live Mode */}
      {liveState.isActive && (
        <LiveRoutineView
          currentBlock={currentBlock}
          nextBlock={nextBlockData}
          elapsed={elapsed}
          onNext={nextBlock}
          onSkip={skipBlock}
          onStop={stopDay}
        />
      )}

      {/* Block List */}
      {!liveState.isActive && (
        <div className="space-y-3">
          {timeline.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No routine blocks yet</p>
              <p className="text-sm mt-1">Add your first block to start designing your day</p>
            </motion.div>
          ) : (
            timeline.map((block, i) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {i > 0 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-4 bg-border" />
                  </div>
                )}
                <RoutineBlockCard
                  block={block}
                  calculatedStart={block.calculatedStart}
                  onEdit={handleEdit}
                  onDelete={deleteBlock}
                />
              </motion.div>
            ))
          )}
        </div>
      )}

      <RoutineModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingBlock(null); }}
        onSave={handleSave}
        editingBlock={editingBlock}
      />
    </div>
  );
}
