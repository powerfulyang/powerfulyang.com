import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type PortalProps<T = HTMLElement> = {
  container: T | (() => T);
};

export function usePortal({ container }: PortalProps) {
  const rootElemRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const containerElement = typeof container === 'function' ? container() : container;
    // Parent is either a new root or the existing dom element
    rootElemRef.current = containerElement || document.body;
  }, [container]);

  const Portal = useCallback(
    ({ children }: { children: ReactNode }) => {
      if (rootElemRef.current != null) return createPortal(children, rootElemRef.current);
      return null;
    },
    [rootElemRef],
  );

  return { target: rootElemRef.current, Portal };
}
