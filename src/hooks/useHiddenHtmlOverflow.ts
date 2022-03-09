import { useEffect } from 'react';

export const useHiddenHtmlOverflow = (hidden: boolean) => {
  useEffect(() => {
    if (hidden) {
      const html = document.getElementsByTagName('html')[0];
      const originOverflow = html.style.overflow;
      html.style.overflow = 'hidden';
      return () => {
        html.style.overflow = originOverflow;
      };
    }
    return () => {};
  }, [hidden]);
};
