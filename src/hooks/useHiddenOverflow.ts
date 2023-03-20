import { useEffect } from 'react';

export const useHiddenOverflow = (hidden: boolean) => {
  useEffect(() => {
    if (hidden) {
      const html = document.body;
      const originOverflow = html.style.overflow;
      html.style.overflow = 'hidden';
      html.style.overflow = 'clip';
      return () => {
        html.style.overflow = originOverflow;
      };
    }
    return () => {};
  }, [hidden]);
};
