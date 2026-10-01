import React, { useState, useEffect } from 'react';

/**
 * AnimatedCounter: smoothly counts up from 0 to target value once on render.
 * Honors prefers-reduced-motion.
 */
export default function AnimatedCounter({ value, duration = 800, prefix = '', suffix = '' }) {
  const numericTarget = typeof value === 'number' ? value : parseInt(value, 10) || 0;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Check for reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(numericTarget);
      return;
    }

    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(easedProgress * numericTarget));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(numericTarget);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [numericTarget, duration]);

  return (
    <span>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
