import React, { useState } from 'react';
import { Bell, X, Check, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'reminder';
  read: boolean;
  timestamp: number;
}

interface Props {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const typeStyles: Record<string, string> = {
  info: 'bg-blue-500/10 text-blue-600',
  warning: 'bg-amber-500/10 text-amber-600',
  success: 'bg-green-500/10 text-green-600',
  reminder: 'bg-primary/10 text-primary',
};

export function NotificationCenter({ notifications, onMarkRead, onMarkAllRead, onDelete, onClearAll }: Props) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onMarkAllRead}>
                <Check className="h-3 w-3 mr-1" /> Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={onClearAll}>
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="max-h-80">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No notifications
              </div>
            ) : (
              notifications.map(n => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={cn(
                    'flex gap-3 p-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors',
                    !n.read && 'bg-primary/5'
                  )}
                  onClick={() => onMarkRead(n.id)}
                >
                  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center shrink-0', typeStyles[n.type])}>
                    {n.type === 'reminder' ? <Clock className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm truncate', !n.read && 'font-medium')}>{n.title}</p>
                      <Button
                        variant="ghost" size="icon" className="h-5 w-5 shrink-0"
                        onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.timestamp)}</p>
                  </div>
                  {!n.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
