import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useRoutine } from '@/hooks/useRoutine';
import { RoutineBlock } from '@/types/routine';
import { DraggableRoutineBlock } from '@/components/routine/DraggableRoutineBlock';
import { RoutineModal } from '@/components/routine/RoutineModal';
import { LiveRoutineView } from '@/components/routine/LiveRoutineView';
import { ExcelUploader } from '@/components/routine/ExcelUploader';
import { Button } from '@/components/ui/button';
import { Plus, Play, Clock, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Routine() {
  const {
    blocks, addBlock, updateBlock, deleteBlock, reorderBlocks,
    getCalculatedTimeline, liveState, elapsed,
    currentBlock, nextBlockData, startDay, nextBlock, skipBlock, stopDay,
  } = useRoutine();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<RoutineBlock | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const timeline = getCalculatedTimeline();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = timeline.findIndex(b => b.id === active.id);
    const newIndex = timeline.findIndex(b => b.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...timeline];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    reorderBlocks(reordered);
  };

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

  const handleImport = (importedBlocks: Omit<RoutineBlock, 'id' | 'order'>[]) => {
    importedBlocks.forEach(b => addBlock(b));
    setShowUploader(false);
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
          <Button onClick={() => setShowUploader(!showUploader)} size="sm" variant="outline">
            <Upload className="h-4 w-4 mr-1" /> Import
          </Button>
          <Button onClick={() => { setEditingBlock(null); setModalOpen(true); }} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" /> Add Block
          </Button>
        </div>
      </div>

      {/* Excel Uploader */}
      <AnimatePresence>
        {showUploader && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ExcelUploader onImport={handleImport} />
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Block List with DnD */}
      {!liveState.isActive && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={timeline.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {timeline.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 text-muted-foreground"
                >
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No routine blocks yet</p>
                  <p className="text-sm mt-1">Add blocks or import your schedule to start</p>
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
                    <DraggableRoutineBlock
                      block={block}
                      onEdit={handleEdit}
                      onDelete={deleteBlock}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
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
