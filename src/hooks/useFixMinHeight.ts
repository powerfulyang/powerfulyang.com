import { useIsomorphicLayoutEffect } from 'framer-motion';

export const useFixMinHeight = () => {
  useIsomorphicLayoutEffect(() => {
    const fixRootElement = document.getElementById('__next');
    if (fixRootElement) {
      fixRootElement.style.cssText = `
      overflow: hidden;
      overflow: clip;
      `;
      return () => {
        fixRootElement.removeAttribute('style');
      };
    }
    return () => null;
  }, []);
};
