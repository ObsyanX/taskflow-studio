import React, { memo, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Calendar, Edit2, Trash2, GripVertical, Check, RotateCcw } from 'lucide-react';
import { Task } from '@/types/task';
import { AnimatedCheckbox } from './AnimatedCheckbox';
import { PriorityChip } from './PriorityChip';
import { formatDueDate, isDueDatePast, triggerHaptic } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const TaskCard = memo(function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  index,
}: TaskCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const handleToggle = useCallback(() => {
    triggerHaptic('light');
    onToggle(task.id);
  }, [onToggle, task.id]);

  const handleEdit = useCallback(() => {
    onEdit(task);
  }, [onEdit, task]);

  const handleDelete = useCallback(() => {
    triggerHaptic('medium');
    onDelete(task.id);
  }, [onDelete, task.id]);

  const dueDateFormatted = formatDueDate(task.due);
  const isOverdue = isDueDatePast(task.due) && !task.done;

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 30,
        delay: index * 0.05,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className="gpu-accelerated"
    >
      <div
        className={cn(
          'task-card group relative flex gap-2 sm:gap-4 p-3 sm:p-4 transition-all duration-200',
          task.done && 'completed',
          isHovered && 'scale-[1.01]'
        )}
        style={{
          boxShadow: isHovered ? 'var(--shadow-xl)' : 'var(--shadow-md)',
        }}
      >
        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Drag handle (visual only for now) */}
        <div className="hidden sm:flex items-center opacity-0 group-hover:opacity-50 transition-opacity cursor-grab">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Checkbox */}
        <div className="flex items-start pt-0.5">
          <AnimatedCheckbox
            checked={task.done}
            onChange={handleToggle}
            aria-label={`Mark "${task.title}" as ${task.done ? 'incomplete' : 'complete'}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'task-title text-sm sm:text-base font-medium text-foreground truncate transition-all',
                  task.done && 'line-through text-muted-foreground'
                )}
              >
                {task.title}
              </h3>
              {task.desc && (
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {task.desc}
                </p>
              )}
            </div>
            <PriorityChip priority={task.priority} />
          </div>

          {/* Meta info */}
          <div className="mt-2 sm:mt-3 flex items-center gap-4">
            {task.due && (
              <div
                className={cn(
                  'flex items-center gap-1.5 text-[10px] sm:text-xs font-medium',
                  isOverdue ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>{dueDateFormatted}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <motion.div
          className="flex items-center gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
          initial={false}
          animate={{ x: isHovered ? 0 : 10 }}
          transition={{ duration: 0.15 }}
        >
          <button
            onClick={handleToggle}
            className={cn(
              'btn-ghost',
              task.done 
                ? 'text-muted-foreground hover:text-foreground hover:bg-muted' 
                : 'text-success hover:text-success hover:bg-success/10'
            )}
            aria-label={task.done ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
          >
            {task.done ? <RotateCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          </button>
          <button
            onClick={handleEdit}
            className="btn-ghost"
            aria-label={`Edit "${task.title}"`}
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="btn-ghost text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label={`Delete "${task.title}"`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
});
