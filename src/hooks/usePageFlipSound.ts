import { useCallback, useRef } from 'react';

// Create a subtle page flip sound using Web Audio API
export function usePageFlipSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playPageFlip = useCallback(() => {
    try {
      // Create or reuse audio context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      // Resume if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Create oscillator for a subtle paper rustle sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // White noise-like effect using oscillator
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);

      // Bandpass filter for paper-like quality
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.Q.setValueAtTime(0.5, now);

      // Very subtle volume - barely audible
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.03, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      // Connect nodes
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Play
      oscillator.start(now);
      oscillator.stop(now + 0.15);

      // Add a second layer for more realistic paper sound
      const noise = ctx.createOscillator();
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();

      noise.type = 'triangle';
      noise.frequency.setValueAtTime(1500, now);
      noise.frequency.exponentialRampToValueAtTime(500, now + 0.08);

      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1000, now);

      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.02, now + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.1);

    } catch (e) {
      // Silently fail if Web Audio API not available
      console.warn('Could not play page flip sound:', e);
    }
  }, []);

  return { playPageFlip };
}
