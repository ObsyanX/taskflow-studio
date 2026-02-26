import React, { useState } from 'react';
import { Volume2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export interface SoundOption {
  id: string;
  label: string;
  data: string;
}

// Short base64-encoded notification sounds
export const NOTIFICATION_SOUNDS: SoundOption[] = [
  {
    id: 'chime',
    label: '🔔 Chime',
    data: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleS0TKZjJ3r1+RicIMX7M4shxNRQAIXbF4chpLwz/GWvD5cZiKAb/EVjB582VVBsC/wdLwuvTj1UaAP8AQ8Tw14lQFf7+PsT03oRLEPz8OcX35n9GC/r5NMn66XpBBvf2McwAAHY8Avb0LtEDAXI3APTzK9UGBm8yAO/wKNkJCmoqAO/uJN0NCmYjAO7sH+AQDGIdAOzpG+MTDl0WAOrmFuUWEFkQAOfiEugZEVQJAOTeCusaEU8D/+DbB+4bEEoA/93XA/EcD0YA/NrRAPQeD0L+99nNAPchDz/89tXKAPslDjz67tfH/fkoDTO379bF+/wrDDD039bE+f8vDC3u49fD+P8yDCrq5trC9gA2DCfm6t3B8gA6DSPi7+C/7gE+DyDe8+K97AFBEBzb9+W76gNFEhnY+ui55gRJFBbV/eu24QZMFhTT/u6z3gZPGRHS/fCw2gdSGw/Q/PKu1ghVHQ7O+vSr0wdYHwzN+fas0AdaIAvL9/mq0AZdIgvK9fqp0AVfJArJ9Pyn0QNZJQ==',
  },
  {
    id: 'bell',
    label: '🛎️ Bell',
    data: 'data:audio/wav;base64,UklGRl9FAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAP//AQACAAEA//8AAAEAAQAAAP//AQABAAAA//8BAAEAAAD//wEAAQAAAP//AQABAAEA//8AAAEAAQAAAP//AQABAAAA//8BAAEAAAD//wEAAQAAAP//AQABAAEA//8AAAEAAQAAAP//AQABAAAA',
  },
  {
    id: 'ping',
    label: '📢 Ping',
    data: 'data:audio/wav;base64,UklGRiQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAFAACBAYF/gX+Bf4F/gQGBAYEBgX+BfwF/AX8BfwF/AX8BgQGBAYF/gX8Bf4F/AX8BfwGBAYF/gX+BfwF/AX8BfwF/AYEBgX+Bf4F/AX8BfwF/AX8BgQGBf4F/gX8BfwF/AX8BfwGBAYF/gX+BfwF/AX8BfwF/AYEBgX+Bf4F/AX8BfwF/AX8B',
  },
  {
    id: 'whoosh',
    label: '💨 Whoosh',
    data: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAAB/f39/f39+fn5+fn59fX19fHx8fHt7e3t6enp6eXl5eXh4eHd3d3d2dnZ1dXV1dHR0c3NzczIyMjExMTAwMC8vLy4uLi0tLS0sLCwrKysqKioqKSkpKCgoJycnJycmJiYlJSUkJCQkIyMj',
  },
  {
    id: 'none',
    label: '🔇 None',
    data: '',
  },
];

const STORAGE_KEY = 'habit-notification-sound';

export function getSelectedSoundId(): string {
  return localStorage.getItem(STORAGE_KEY) || 'chime';
}

export function getSelectedSound(): SoundOption {
  const id = getSelectedSoundId();
  return NOTIFICATION_SOUNDS.find(s => s.id === id) || NOTIFICATION_SOUNDS[0];
}

export function playSound(soundId?: string) {
  const sound = soundId
    ? NOTIFICATION_SOUNDS.find(s => s.id === soundId)
    : getSelectedSound();
  if (!sound || !sound.data) return;
  try {
    const audio = new Audio(sound.data);
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {
    // Audio not supported
  }
}

export function NotificationSoundPicker() {
  const [selected, setSelected] = useState(getSelectedSoundId);

  const handleSelect = (id: string) => {
    setSelected(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const handlePreview = (e: React.MouseEvent, sound: SoundOption) => {
    e.preventDefault();
    e.stopPropagation();
    if (sound.data) {
      const audio = new Audio(sound.data);
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
  };

  const currentLabel = NOTIFICATION_SOUNDS.find(s => s.id === selected)?.label || 'Chime';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Alert Sound</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {NOTIFICATION_SOUNDS.map(sound => (
          <DropdownMenuItem
            key={sound.id}
            className={`flex items-center justify-between ${selected === sound.id ? 'bg-accent' : ''}`}
            onClick={() => handleSelect(sound.id)}
          >
            <span>{sound.label}</span>
            {sound.data && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => handlePreview(e, sound)}
              >
                <Play className="w-3 h-3" />
              </Button>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
