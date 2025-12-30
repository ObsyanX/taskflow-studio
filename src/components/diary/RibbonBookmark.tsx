import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface RibbonBookmarkProps {
  bookmarkedDate: string | null;
  currentDate: string;
  onJumpToBookmark: () => void;
  onSetBookmark: () => void;
}

export const RibbonBookmark = memo(function RibbonBookmark({
  bookmarkedDate,
  currentDate,
  onJumpToBookmark,
  onSetBookmark,
}: RibbonBookmarkProps) {
  const isCurrentDateBookmarked = bookmarkedDate === currentDate;

  return (
    <div className="absolute top-0 right-4 z-10">
      {/* Physical ribbon */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative group"
      >
        {/* Ribbon body */}
        <div
          className={cn(
            'w-4 h-24 shadow-lg transition-colors cursor-pointer',
            isCurrentDateBookmarked
              ? 'bg-gradient-to-b from-red-600 to-red-800'
              : 'bg-gradient-to-b from-red-700/80 to-red-900/80'
          )}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 90%, 0 100%)',
          }}
        />

        {/* Tooltip on hover */}
        <div className="absolute left-full top-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2 whitespace-nowrap">
            {bookmarkedDate ? (
              <p className="text-xs text-muted-foreground">
                Bookmarked: {format(parseISO(bookmarkedDate), 'MMM d, yyyy')}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                No bookmark set
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {bookmarkedDate && bookmarkedDate !== currentDate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onJumpToBookmark}
              className="w-10 h-10 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
              title="Jump to bookmark"
            >
              <Bookmark className="w-4 h-4 text-red-600 fill-red-600" />
            </motion.button>
          )}
          
          {!isCurrentDateBookmarked && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSetBookmark}
              className="w-10 h-10 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
              title="Set bookmark here"
            >
              <Bookmark className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
});
