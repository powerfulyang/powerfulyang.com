import { useEffect, useState } from 'react';

export const useClientState = <T>(func: () => T) => {
  const [r, setR] = useState<T>();
  useEffect(() => {
    setR(func);
  }, []);
  return [r, setR] as const;
};
