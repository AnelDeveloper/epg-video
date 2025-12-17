import { useState, useEffect, useRef } from 'react';

const HIDE_DELAY = 3000;

export function useAutoHideUI() {
  const [isUIVisible, setIsUIVisible] = useState(true);
  const hideTimeoutRef = useRef<number | null>(null);

  const resetHideTimer = () => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setIsUIVisible(true);

    hideTimeoutRef.current = window.setTimeout(() => {
      setIsUIVisible(false);
      hideTimeoutRef.current = null;
    }, HIDE_DELAY);
  };

  useEffect(() => {
    resetHideTimer();

    window.addEventListener('mousemove', resetHideTimer);
    window.addEventListener('mousedown', resetHideTimer);
    window.addEventListener('keydown', resetHideTimer);

    return () => {
      if (hideTimeoutRef.current !== null) {
        clearTimeout(hideTimeoutRef.current);
      }
      window.removeEventListener('mousemove', resetHideTimer);
      window.removeEventListener('mousedown', resetHideTimer);
      window.removeEventListener('keydown', resetHideTimer);
    };
  }, []);

  return isUIVisible;
}
