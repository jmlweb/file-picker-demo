import { useEffect, useCallback, useRef } from 'react';

export default function useScrollAreaResizing() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const updateScrollAreaHeight = useCallback(() => {
    requestAnimationFrame(() => {
      const scrollArea = scrollAreaRef.current;
      if (!scrollArea) return;

      const height = scrollArea.clientHeight - 20;
      if (height > 0) {
        scrollArea.style.setProperty('--max-scroll-area', `${height}px`);
      }
    });
  }, []);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const resizeObserver = new ResizeObserver(updateScrollAreaHeight);
    resizeObserver.observe(scrollArea);

    // Initial height calculation
    updateScrollAreaHeight();

    return () => resizeObserver.disconnect();
  }, [updateScrollAreaHeight]);

  return scrollAreaRef;
}
