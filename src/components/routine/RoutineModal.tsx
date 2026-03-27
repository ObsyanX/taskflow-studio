import React, { useState, useEffect } from 'react';
import { RoutineBlock, BlockType, FlowMode } from '@/types/routine';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (block: Omit<RoutineBlock, 'id' | 'order'> | Partial<RoutineBlock>) => void;
  editingBlock?: RoutineBlock | null;
}

export function RoutineModal({ open, onClose, onSave, editingBlock }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<BlockType>('work');
  const [duration, setDuration] = useState(30);
  const [flowMode, setFlowMode] = useState<FlowMode>('sequential');
  const [startTime, setStartTime] = useState('');
  const [reminderStart, setReminderStart] = useState(true);
  const [reminderEnd, setReminderEnd] = useState(true);

  useEffect(() => {
    if (editingBlock) {
      setTitle(editingBlock.title);
      setType(editingBlock.type);
      setDuration(editingBlock.duration);
      setFlowMode(editingBlock.flowMode);
      setStartTime(editingBlock.startTime || '');
      setReminderStart(editingBlock.reminderStart);
      setReminderEnd(editingBlock.reminderEnd);
    } else {
      setTitle('');
      setType('work');
      setDuration(30);
      setFlowMode('sequential');
      setStartTime('');
      setReminderStart(true);
      setReminderEnd(true);
    }
  }, [editingBlock, open]);

  const handleSave = () => {
    if (!title.trim()) return;
    const data = {
      title: title.trim(),
      type,
      duration,
      flowMode,
      startTime: flowMode === 'fixed' && startTime ? startTime : undefined,
      reminderStart,
      reminderEnd,
      repeat: 'daily' as const,
    };
    if (editingBlock) {
      onSave({ ...data, id: editingBlock.id, order: editingBlock.order });
    } else {
      onSave(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingBlock ? 'Edit Block' : 'Add Routine Block'}</DialogTitle>
          <DialogDescription>Configure your routine block settings.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Deep Work" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={v => setType(v as BlockType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="meal">Meal</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration (min)</Label>
              <Input type="number" min={5} step={5} value={duration} onChange={e => setDuration(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Flow Mode</Label>
            <Select value={flowMode} onValueChange={v => setFlowMode(v as FlowMode)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sequential">Sequential (auto-flow)</SelectItem>
                <SelectItem value="fixed">Fixed Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {flowMode === 'fixed' && (
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label>Start Reminder</Label>
            <Switch checked={reminderStart} onCheckedChange={setReminderStart} />
          </div>
          <div className="flex items-center justify-between">
            <Label>End Reminder</Label>
            <Switch checked={reminderEnd} onCheckedChange={setReminderEnd} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {editingBlock ? 'Save Changes' : 'Add Block'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
