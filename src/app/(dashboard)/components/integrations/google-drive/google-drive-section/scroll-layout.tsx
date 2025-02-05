import { ScrollBar } from '@/components/ui/scroll-area';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useEffect, useCallback, useRef, ReactNode } from 'react';

function useScrollViewResizing() {
  const scrollViewRef = useRef<HTMLDivElement>(null);

  const updateScrollAreaHeight = useCallback(() => {
    requestAnimationFrame(() => {
      const scrollArea = scrollViewRef.current;
      if (!scrollArea) return;

      const height = scrollArea.clientHeight - 20;
      if (height > 0) {
        scrollArea.style.setProperty('--max-scroll-area', `${height}px`);
      }
    });
  }, []);

  useEffect(() => {
    const scrollArea = scrollViewRef.current;
    if (!scrollArea) return;

    const resizeObserver = new ResizeObserver(updateScrollAreaHeight);
    resizeObserver.observe(scrollArea);

    // Initial height calculation
    updateScrollAreaHeight();

    return () => resizeObserver.disconnect();
  }, [updateScrollAreaHeight]);

  return scrollViewRef;
}

export default function ScrollLayout({ children }: { children: ReactNode }) {
  const scrollViewRef = useScrollViewResizing();
  return (
    <div className="flex flex-1 flex-col" ref={scrollViewRef}>
      <ScrollArea className="w-full flex-1 [&>[data-radix-scroll-area-viewport]]:max-h-[--max-scroll-area]">
        {children}
        <ScrollBar />
      </ScrollArea>
    </div>
  );
}
