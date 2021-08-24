import { useEffect, useState } from 'react';
import { useFixed } from '@powerfulyang/hooks';

export const useClientState = (func: () => string) => {
  const [r, setR] = useState<string>();
  const fixedFunc = useFixed(func);
  useEffect(() => {
    setR(fixedFunc());
  }, [fixedFunc]);
  return r;
};
