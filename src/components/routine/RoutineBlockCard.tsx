import React from 'react';
import { RoutineBlock, BlockType } from '@/types/routine';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase, UtensilsCrossed, Heart, BookOpen, Sparkles,
  Clock, Bell, BellOff, GripVertical, Pencil, Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const typeConfig: Record<BlockType, { icon: React.ElementType; label: string; color: string }> = {
  work: { icon: Briefcase, label: 'Work', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  meal: { icon: UtensilsCrossed, label: 'Meal', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  health: { icon: Heart, label: 'Health', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  study: { icon: BookOpen, label: 'Study', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  custom: { icon: Sparkles, label: 'Custom', color: 'bg-muted text-muted-foreground' },
};

function formatDuration(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

interface Props {
  block: RoutineBlock;
  calculatedStart?: number;
  isActive?: boolean;
  isLive?: boolean;
  onEdit: (block: RoutineBlock) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export function RoutineBlockCard({ block, calculatedStart, isActive, isLive, onEdit, onDelete, dragHandleProps }: Props) {
  const config = typeConfig[block.type];
  const Icon = config.icon;

  const startLabel = block.flowMode === 'fixed' && block.startTime
    ? formatTime(block.startTime)
    : calculatedStart != null
      ? (() => { const h = Math.floor(calculatedStart / 60); const m = calculatedStart % 60; return formatTime(`${h}:${m.toString().padStart(2, '0')}`); })()
      : 'Auto';

  return (
    <Card className={cn(
      'transition-all duration-200 border',
      isActive && 'ring-2 ring-primary shadow-lg scale-[1.02]',
      !isActive && 'hover:shadow-md',
    )}>
      <CardContent className="flex items-center gap-3 p-4">
        {!isLive && (
          <div {...dragHandleProps} className="cursor-grab text-muted-foreground hover:text-foreground">
            <GripVertical className="h-4 w-4" />
          </div>
        )}

        <div className={cn('flex items-center justify-center h-10 w-10 rounded-lg shrink-0', config.color)}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{block.title}</h3>
            <Badge variant="outline" className="text-xs shrink-0">{config.label}</Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {startLabel}
            </span>
            <span>{formatDuration(block.duration)}</span>
            <span className="flex items-center gap-1">
              {block.reminderStart || block.reminderEnd
                ? <Bell className="h-3 w-3 text-primary" />
                : <BellOff className="h-3 w-3" />}
            </span>
          </div>
        </div>

        {!isLive && (
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(block)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(block.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
