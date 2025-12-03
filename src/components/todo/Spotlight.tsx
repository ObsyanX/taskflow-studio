import React, { memo, useEffect, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

interface SpotlightProps {
  enabled?: boolean;
}

export const Spotlight = memo(function Spotlight({ enabled = true }: SpotlightProps) {
  const [isMobile, setIsMobile] = useState(false);
  const mousePosition = useMousePosition(enabled && !isMobile);

  useEffect(() => {
    // Check if device is mobile/touch
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none)').matches || window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!enabled || isMobile) return null;

  return (
    <div
      className="spotlight"
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
});
