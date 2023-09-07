import { useWorkerLoader } from '@/hooks/useWorkerLoader';
import { trpc } from '@/utils/trpc';
import type { PrettierWorker } from '@/workers/prettier.worker';
import { useQuery } from '@tanstack/react-query';
import globToRegExp from 'glob-to-regexp';
import { useMemo, useState } from 'react';

export enum Action {
  'html2jsx' = 'html2jsx',
  'html2pug' = 'html2pug',
  'glob2regex' = 'glob2regex',
}

export const useTransform = () => {
  const [action, setAction] = useState<Action>(Action.html2jsx);
  const [value, setValue] = useState('');
  const { wrap, isReady } = useWorkerLoader<PrettierWorker>(() => {
    return new Worker(new URL('@/workers/prettier.worker.ts', import.meta.url), {
      name: 'prettier',
      type: 'module',
    });
  });

  const html2jsx = useQuery({
    queryKey: [Action.html2jsx, value],
    enabled: Boolean(isReady && value && action === Action.html2jsx),
    keepPreviousData: true,
    queryFn: () => {
      return wrap!.html2jsx(value);
    },
  });

  const html2pug = trpc.html2pug.useQuery(
    {
      html: value,
    },
    {
      enabled: Boolean(action === 'html2pug' && value),
      keepPreviousData: true,
    },
  );

  const glob2regex = useQuery({
    queryKey: [Action.glob2regex, value],
    enabled: Boolean(value && action === Action.glob2regex),
    keepPreviousData: true,
    queryFn: () => {
      return globToRegExp(value, {
        globstar: true,
        extended: true,
      });
    },
  });

  const result = useMemo(() => {
    let _result;
    if (action === Action.html2jsx) {
      _result = html2jsx.data;
    }
    if (action === Action.html2pug) {
      _result = html2pug.data;
    }
    if (action === Action.glob2regex) {
      _result = glob2regex.data?.source;
    }
    return _result ?? '';
  }, [action, html2jsx.data, html2pug.data, glob2regex.data?.source]);

  return {
    action,
    setAction,
    value,
    setValue,
    result,
  };
};
