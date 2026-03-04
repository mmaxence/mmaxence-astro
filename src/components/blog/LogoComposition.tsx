'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Animated logo composition: logo mark centered on a cycling background.
 * 12 background variations, logo picks the best contrasting color.
 * Each transition triggers a subtle vibration on the logo.
 */

const LOGO_PATH =
  'M41.8181 230.081L-7.62572e-05 377.903L295.324 346.128L215.926 619.116C174.403 761.879 290.773 901.214 438.649 885.796L1171.68 809.366C1256.57 800.516 1327.58 741.026 1351.17 659.009L1394.38 508.743L1100.92 538.649L1178.46 266.811C1219.16 124.147 1102.65 -14.409 955.116 1.20647L221.222 78.8856C136.144 87.8907 65.1067 147.758 41.8181 230.081ZM887.842 282.577L588.779 314.352L506.537 604.069L803.731 572.294L887.842 282.577Z';

interface ColorPair {
  bg: string;
  logo: string;
}

const COLOR_PAIRS: ColorPair[] = [
  { bg: '#FFFFFF', logo: '#171717' },
  { bg: '#171717', logo: '#FFFFFF' },
  { bg: '#EF4444', logo: '#FFFFFF' },
  { bg: '#F97316', logo: '#FFFFFF' },
  { bg: '#E5E5E5', logo: '#450A0A' },
  { bg: '#450A0A', logo: '#FB923C' },
  { bg: '#F5F5F5', logo: '#B91C1C' },
  { bg: '#DC2626', logo: '#171717' },
  { bg: '#7C2D12', logo: '#FAFAFA' },
  { bg: '#404040', logo: '#FB923C' },
  { bg: '#EA580C', logo: '#171717' },
  { bg: '#262626', logo: '#EF4444' },
];

export function LogoComposition() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const [pairIdx, setPairIdx] = useState(0);
  const [vibrate, setVibrate] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = useCallback(() => {
    const delay = 1800 + Math.random() * 1200;
    timerRef.current = setTimeout(() => {
      setPairIdx((prev) => {
        let next: number;
        do {
          next = Math.floor(Math.random() * COLOR_PAIRS.length);
        } while (next === prev);
        return next;
      });
      setVibrate(true);
      setTimeout(() => setVibrate(false), 400);
      scheduleNext();
    }, delay);
  }, []);

  useEffect(() => {
    if (!inView) return;
    const initialDelay = setTimeout(() => {
      scheduleNext();
    }, 1200);
    return () => {
      clearTimeout(initialDelay);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inView, scheduleNext]);

  const pair = COLOR_PAIRS[pairIdx];

  return (
    <motion.div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '1rem',
        border: '1px solid rgba(128,128,128,0.2)',
        aspectRatio: '3 / 1',
      }}
      animate={{ backgroundColor: pair.bg }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.svg
          viewBox="0 0 1395 887"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '28%', height: 'auto' }}
          animate={{
            fill: pair.logo,
            rotate: vibrate ? [0, -2, 2, -1.5, 1.5, -0.5, 0.5, 0] : 0,
            scale: vibrate ? [1, 1.03, 0.97, 1.02, 0.98, 1.01, 1] : 1,
          }}
          transition={{
            fill: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const },
            rotate: { duration: 0.4, ease: 'easeOut' as const },
            scale: { duration: 0.4, ease: 'easeOut' as const },
          }}
        >
          <path fillRule="evenodd" clipRule="evenodd" d={LOGO_PATH} />
        </motion.svg>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.04,
          mixBlendMode: 'overlay',
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />
    </motion.div>
  );
}
