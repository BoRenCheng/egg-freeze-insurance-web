import { useEffect, useRef, useState } from 'react';

export function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(target);
  const startRef = useRef(target);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = startRef.current;
    const to = target;
    if (from === to) return;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setValue(current);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else startRef.current = to;
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

export default function CountUp({ value, duration = 800, prefix = '', suffix = '', format = true }) {
  const display = useCountUp(value, duration);
  const formatted = format ? display.toLocaleString() : display;
  return <>{prefix}{formatted}{suffix}</>;
}
