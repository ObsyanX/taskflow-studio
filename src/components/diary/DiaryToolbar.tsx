import React, { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bold, Italic, Underline } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DiaryFontSelector, DiaryFont } from './DiaryFontSelector';
import { Slider } from '@/components/ui/slider';

interface DiaryToolbarProps {
  selectedFont: DiaryFont;
  fontSize: number;
  onFontChange: (font: DiaryFont) => void;
  onFontSizeChange: (size: number) => void;
}

export const DiaryToolbar = memo(function DiaryToolbar({
  selectedFont,
  fontSize,
  onFontChange,
  onFontSizeChange,
}: DiaryToolbarProps) {
  // Execute formatting commands
  const execCommand = useCallback((command: string) => {
    document.execCommand(command, false);
    // Refocus the editor
    const editor = document.querySelector('.diary-editor') as HTMLElement;
    editor?.focus();
  }, []);

  return (
    <div className={cn(
      'flex items-center gap-3 flex-wrap',
      'p-2 rounded-xl',
      'bg-card/50 backdrop-blur-sm border border-border/50'
    )}>
      {/* Font Selector */}
      <DiaryFontSelector
        selectedFont={selectedFont}
        onFontChange={onFontChange}
      />

      {/* Separator */}
      <div className="w-px h-6 bg-border/50" />

      {/* Font Size Control */}
      <div className="flex items-center gap-2 min-w-[140px]">
        <span className="text-xs text-muted-foreground w-4">{fontSize}</span>
        <Slider
          value={[fontSize]}
          onValueChange={(values) => onFontSizeChange(values[0])}
          min={8}
          max={28}
          step={1}
          className="w-20"
        />
        <span className="text-xs text-muted-foreground">px</span>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-border/50" />

      {/* Formatting Buttons */}
      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => execCommand('bold')}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'bg-muted/50 hover:bg-muted text-foreground/70 hover:text-foreground',
            'transition-colors'
          )}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => execCommand('italic')}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'bg-muted/50 hover:bg-muted text-foreground/70 hover:text-foreground',
            'transition-colors'
          )}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => execCommand('underline')}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            'bg-muted/50 hover:bg-muted text-foreground/70 hover:text-foreground',
            'transition-colors'
          )}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
});
