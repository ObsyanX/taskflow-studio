import React, { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, differenceInDays, addDays } from 'date-fns';

interface PageFlipAnimationProps {
  startDate: string | null;
  endDate: string;
  onComplete: () => void;
}

export const PageFlipAnimation = memo(function PageFlipAnimation({
  startDate,
  endDate,
  onComplete,
}: PageFlipAnimationProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(true);

  // Calculate total pages to flip
  const start = startDate ? parseISO(startDate) : parseISO(endDate);
  const end = parseISO(endDate);
  const totalDays = Math.max(differenceInDays(end, start), 0);
  const maxPages = Math.min(totalDays, 30); // Cap at 30 pages for performance

  useEffect(() => {
    if (!isFlipping) return;

    const pagesPerSecond = Math.max(8, maxPages / 2); // Faster for more pages
    const interval = 1000 / pagesPerSecond;

    const timer = setInterval(() => {
      setCurrentPageIndex(prev => {
        if (prev >= maxPages) {
          setIsFlipping(false);
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return prev;
        }
        return prev + 1;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isFlipping, maxPages, onComplete]);

  // Get date for current page
  const getCurrentDate = () => {
    const daysToAdd = Math.floor((currentPageIndex / maxPages) * totalDays);
    return format(addDays(start, daysToAdd), 'MMMM d, yyyy');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Book Container */}
      <div className="relative w-[300px] h-[400px] perspective-1000">
        {/* Background pages (stack effect) */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 rounded-lg shadow-sm"
            style={{
              transform: `translateX(${i * 2}px) translateY(${i * 1}px)`,
              zIndex: -i,
            }}
          />
        ))}

        {/* Flipping pages */}
        <AnimatePresence mode="popLayout">
          {isFlipping && (
            <motion.div
              key={currentPageIndex}
              initial={{ rotateY: 0, opacity: 1 }}
              animate={{ rotateY: -180, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 rounded-lg shadow-md origin-left"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Page lines */}
              <div className="absolute inset-4 opacity-10">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-px bg-foreground my-5"
                  />
                ))}
              </div>

              {/* Date */}
              <div className="absolute top-6 left-6 right-6">
                <p className="text-xs text-muted-foreground font-medium">
                  {getCurrentDate()}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final page (current date) */}
        {!isFlipping && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 rounded-lg shadow-lg"
          >
            {/* Page lines */}
            <div className="absolute inset-4 opacity-10">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-px bg-foreground my-5"
                />
              ))}
            </div>

            {/* Today's date */}
            <div className="absolute top-6 left-6 right-6">
              <p className="text-sm font-serif text-foreground">
                {format(end, 'EEEE')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(end, 'MMMM d, yyyy')}
              </p>
            </div>

            {/* Ribbon bookmark */}
            <div 
              className="absolute top-0 right-6 w-3 h-16 bg-gradient-to-b from-red-700 to-red-800 rounded-b-sm shadow-md"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)',
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-center"
      >
        {isFlipping ? (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Opening your diary...
            </p>
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentPageIndex / maxPages) * 100}%` }}
              />
            </div>
          </>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground"
          >
            Ready to write...
          </motion.p>
        )}
      </motion.div>
    </div>
  );
});
