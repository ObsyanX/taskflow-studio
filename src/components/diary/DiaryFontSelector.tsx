import React, { memo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DiaryFont {
  name: string;
  family: string;
  category: 'classic' | 'intimate' | 'stylish' | 'casual';
}

export const DIARY_FONTS: DiaryFont[] = [
  // Classic & Readable
  { name: 'Dancing Script', family: "'Dancing Script', cursive", category: 'classic' },
  { name: 'Pacifico', family: "'Pacifico', cursive", category: 'classic' },
  { name: 'Caveat', family: "'Caveat', cursive", category: 'classic' },
  
  // Intimate & Personal
  { name: 'Kalam', family: "'Kalam', cursive", category: 'intimate' },
  { name: 'Indie Flower', family: "'Indie Flower', cursive", category: 'intimate' },
  { name: 'Shadows Into Light', family: "'Shadows Into Light', cursive", category: 'intimate' },
  { name: 'Homemade Apple', family: "'Homemade Apple', cursive", category: 'intimate' },
  
  // Stylish & Elegant
  { name: 'Great Vibes', family: "'Great Vibes', cursive", category: 'stylish' },
  { name: 'Pinyon Script', family: "'Pinyon Script', cursive", category: 'stylish' },
  { name: 'Sacramento', family: "'Sacramento', cursive", category: 'stylish' },
  { name: 'Satisfy', family: "'Satisfy', cursive", category: 'stylish' },
  
  // Casual & Quirky
  { name: 'Nothing You Could Do', family: "'Nothing You Could Do', cursive", category: 'casual' },
  { name: 'Reenie Beanie', family: "'Reenie Beanie', cursive", category: 'casual' },
  { name: 'La Belle Aurore', family: "'La Belle Aurore', cursive", category: 'casual' },
];

const CATEGORY_LABELS: Record<string, string> = {
  classic: 'Classic & Readable',
  intimate: 'Intimate & Personal',
  stylish: 'Stylish & Elegant',
  casual: 'Casual & Quirky',
};

interface DiaryFontSelectorProps {
  selectedFont: DiaryFont;
  onFontChange: (font: DiaryFont) => void;
}

export const DiaryFontSelector = memo(function DiaryFontSelector({
  selectedFont,
  onFontChange,
}: DiaryFontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group fonts by category
  const fontsByCategory = DIARY_FONTS.reduce((acc, font) => {
    if (!acc[font.category]) acc[font.category] = [];
    acc[font.category].push(font);
    return acc;
  }, {} as Record<string, DiaryFont[]>);

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-card/80 backdrop-blur-sm border border-border/50',
          'hover:bg-muted/50 transition-colors',
          'min-w-[180px] justify-between'
        )}
      >
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-muted-foreground" />
          <span 
            className="text-sm text-foreground truncate"
            style={{ fontFamily: selectedFont.family }}
          >
            {selectedFont.name}
          </span>
        </div>
        <ChevronDown 
          className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full left-0 mt-2 z-50',
              'w-64 max-h-80 overflow-y-auto',
              'bg-card border border-border rounded-xl shadow-xl',
              'backdrop-blur-xl'
            )}
          >
            <div className="p-2">
              {Object.entries(fontsByCategory).map(([category, fonts]) => (
                <div key={category} className="mb-2 last:mb-0">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {CATEGORY_LABELS[category]}
                  </div>
                  {fonts.map((font) => (
                    <motion.button
                      key={font.name}
                      whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                      onClick={() => {
                        onFontChange(font);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'w-full px-3 py-2 text-left rounded-lg transition-colors',
                        'flex items-center justify-between',
                        selectedFont.name === font.name && 'bg-primary/10'
                      )}
                    >
                      <span 
                        className="text-base text-foreground"
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </span>
                      <span 
                        className="text-xs text-muted-foreground"
                        style={{ fontFamily: font.family }}
                      >
                        Abc
                      </span>
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
