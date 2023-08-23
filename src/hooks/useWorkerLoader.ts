import { useQuery } from '@tanstack/react-query';
import { wrap } from 'comlink';
import { useEffect } from 'react';

type Func = () => Worker;

export const useWorkerLoader = <T>(func: Func) => {
  const { data, isFetched } = useQuery({
    queryKey: ['useWorkerLoader', func],
    queryFn: () => {
      const _worker = func();
      return {
        wrap: wrap<T>(_worker),
        worker: _worker,
      };
    },
  });

  useEffect(() => {
    return () => {
      return data?.worker?.terminate();
    };
  }, [data?.worker]);

  return {
    worker: data?.worker,
    wrap: data?.wrap,
    isReady: isFetched,
  };
};
