import { DependencyList, useEffect } from 'react';

export const useWindowMouseWheel = (fn: (e: WheelEvent) => void, deps: DependencyList = []) => {
  useEffect(() => {
    const eventCall = (e) => {
      fn(e);
    };
    window.addEventListener('mousewheel', eventCall);
    return () => {
      window.removeEventListener('mousewheel', eventCall);
    };
  }, [fn, ...deps]);
};
