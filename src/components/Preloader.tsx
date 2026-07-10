'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

const MIN_DISPLAY_MS = 2200;

export default function Preloader() {
  const [phase, setPhase] = useState<'intro' | 'hold' | 'exit'>('intro');
  const [mounted, setMounted] = useState(true);

  const exit = useCallback(() => {
    setPhase('exit');
  }, []);

  useEffect(() => {
    // Minimum display timer — guarantees the preloader shows for at least MIN_DISPLAY_MS
    const minTimer = window.setTimeout(() => {
      // If the page has already loaded, exit immediately
      if (document.readyState === 'complete') {
        exit();
      } else {
        // Otherwise mark "hold" phase and wait for load event
        setPhase('hold');
      }
    }, MIN_DISPLAY_MS);

    const onLoad = () => {
      // Only exit once the minimum timer has fired
      if (phase === 'hold') exit();
    };
    window.addEventListener('load', onLoad);

    return () => {
      window.clearTimeout(minTimer);
      window.removeEventListener('load', onLoad);
    };
  }, [phase, exit]);

  // Unmount after exit animation completes
  useEffect(() => {
    if (phase === 'exit') {
      const id = window.setTimeout(() => setMounted(false), 900);
      return () => window.clearTimeout(id);
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {/* ── Logo ────────────────────────────────────────── */}
          <div className="relative flex items-center justify-center">
            {/* Glow ring */}
            <motion.div
              className="absolute h-28 w-28 rounded-3xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(245,158,11,0.35), rgba(234,88,12,0.20))',
                filter: 'blur(24px)',
              }}
              animate={{
                scale: [1, 1.18, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Logo square */}
            <motion.div
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl sm:h-24 sm:w-24"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
              }}
              initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <motion.span
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                style={{ fontFamily: 'system-ui, sans-serif' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                S
              </motion.span>
            </motion.div>
          </div>

          {/* ── Brand text — letter-by-letter reveal ──────── */}
          <div className="mt-6 flex overflow-hidden" aria-label="Studio Créatif">
            {'Studio Créatif'.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block text-sm font-medium tracking-[0.22em] text-foreground/80 sm:text-base"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.55 + i * 0.04,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>

          {/* ── Location line ──────────────────────────────── */}
          <motion.p
            className="mt-2.5 text-[11px] font-normal tracking-[0.18em] uppercase text-foreground/35 sm:text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            Bamako, Mali
          </motion.p>

          {/* ── Loading bar ────────────────────────────────── */}
          <div className="absolute bottom-12 left-1/2 w-48 -translate-x-1/2 sm:bottom-16 sm:w-56">
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-foreground/8">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #f59e0b, #ea580c)',
                }}
                initial={{ width: '0%' }}
                animate={{
                  width: phase === 'exit' ? '100%' : '72%',
                }}
                transition={
                  phase === 'exit'
                    ? { duration: 0.5, ease: 'easeOut' }
                    : {
                        duration: 1.8,
                        ease: [0.22, 1, 0.36, 1],
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }
                }
              />
            </div>

            {/* Shimmer pass */}
            <motion.div
              className="absolute top-0 left-0 h-full w-1/3"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(245,158,11,0.35), transparent)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '400%' }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}