import React, { memo, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bold, Italic, Underline, ImagePlus, X, ZoomIn, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DiaryFontSelector, DiaryFont } from './DiaryFontSelector';
import { Slider } from '@/components/ui/slider';
import { DiaryImage } from '@/types/diary';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface DiaryToolbarProps {
  selectedFont: DiaryFont;
  fontSize: number;
  onFontChange: (font: DiaryFont) => void;
  onFontSizeChange: (size: number) => void;
  images: DiaryImage[];
  onImagesChange: (images: DiaryImage[]) => void;
}

const MAX_IMAGE_SIZE = 800;
const MAX_IMAGES = 6;

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > MAX_IMAGE_SIZE || height > MAX_IMAGE_SIZE) {
          if (width > height) {
            height = Math.round((height * MAX_IMAGE_SIZE) / width);
            width = MAX_IMAGE_SIZE;
          } else {
            width = Math.round((width * MAX_IMAGE_SIZE) / height);
            height = MAX_IMAGE_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const DiaryToolbar = memo(function DiaryToolbar({
  selectedFont,
  fontSize,
  onFontChange,
  onFontSizeChange,
  images,
  onImagesChange,
}: DiaryToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewingImage, setViewingImage] = useState<DiaryImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execCommand = useCallback((command: string) => {
    document.execCommand(command, false);
    const editor = document.querySelector('.diary-editor') as HTMLElement;
    editor?.focus();
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      const newImages: DiaryImage[] = [];
      const remainingSlots = MAX_IMAGES - images.length;

      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const dataUrl = await resizeImage(file);
        newImages.push({
          id: uuidv4(),
          data: dataUrl,
          addedAt: new Date().toISOString(),
        });
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Failed to process image:', error);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [images, onImagesChange]);

  const handleRemoveImage = useCallback((imageId: string) => {
    onImagesChange(images.filter((img) => img.id !== imageId));
  }, [images, onImagesChange]);

  return (
    <div className="space-y-2">
      {/* Compact Toolbar */}
      <div className={cn(
        'flex items-center gap-2 flex-wrap',
        'p-2 rounded-xl',
        'bg-card/50 backdrop-blur-sm border border-border/50'
      )}>
        {/* Font Selector */}
        <DiaryFontSelector
          selectedFont={selectedFont}
          onFontChange={onFontChange}
        />

        {/* Font Size - compact */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground tabular-nums w-5 text-right">{fontSize}</span>
          <Slider
            value={[fontSize]}
            onValueChange={(values) => onFontSizeChange(values[0])}
            min={8}
            max={28}
            step={1}
            className="w-16"
          />
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-border/50 hidden sm:block" />

        {/* Formatting Buttons */}
        <div className="flex items-center gap-0.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => execCommand('bold')}
            className={cn(
              'w-7 h-7 rounded-md flex items-center justify-center',
              'bg-muted/50 hover:bg-muted text-foreground/70 hover:text-foreground',
              'transition-colors'
            )}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => execCommand('italic')}
            className={cn(
              'w-7 h-7 rounded-md flex items-center justify-center',
              'bg-muted/50 hover:bg-muted text-foreground/70 hover:text-foreground',
              'transition-colors'
            )}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => execCommand('underline')}
            className={cn(
              'w-7 h-7 rounded-md flex items-center justify-center',
              'bg-muted/50 hover:bg-muted text-foreground/70 hover:text-foreground',
              'transition-colors'
            )}
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-border/50" />

        {/* Photo Button */}
        {images.length < MAX_IMAGES && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={cn(
              'h-7 px-2 rounded-md flex items-center gap-1.5',
              'bg-muted/50 hover:bg-muted text-foreground/70 hover:text-foreground',
              'transition-colors text-xs',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
            title="Add photo"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{images.length}/{MAX_IMAGES}</span>
          </motion.button>
        )}
      </div>

      {/* Image Grid */}
      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-4 sm:grid-cols-6 gap-1.5"
          >
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="relative aspect-square rounded-md overflow-hidden group"
              >
                <img
                  src={image.data}
                  alt="Diary attachment"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewingImage(image)}
                    className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
                  >
                    <ZoomIn className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveImage(image.id)}
                    className="w-6 h-6 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Full-size image viewer */}
      <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90">
          <DialogTitle className="sr-only">View image</DialogTitle>
          {viewingImage && (
            <div className="relative">
              <img
                src={viewingImage.data}
                alt="Full size diary attachment"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <button
                onClick={() => setViewingImage(null)}
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});
