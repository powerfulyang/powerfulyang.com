import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import type { DependencyList } from 'react';
import { useCallback, useEffect, useMemo } from 'react';
import { useBeforeUnload, useLatest } from '@powerfulyang/hooks';
import { useIsomorphicLayoutEffect } from 'framer-motion';

export const FormDiscardWarningAtom = atom(false);

export const useFormRouteListener = () => {
  const router = useRouter();
  const [formWarning] = useAtom(FormDiscardWarningAtom);

  const ref = useLatest(formWarning);

  const confirm = useCallback(() => {
    if (ref.current) {
      // eslint-disable-next-line no-alert
      return window.confirm('您的表单未保存，确定要离开吗？');
    }
    return true;
  }, [ref]);

  useEffect(() => {
    router.beforePopState((state) => {
      if (state.as !== router.asPath) {
        const bool = confirm();
        if (!bool) {
          process.nextTick(() => {
            window.history.go(1);
          });
          return false;
        }
      }
      return true;
    });
  }, [confirm, router]);
};

export const useFormDiscardWarning = (isModify: () => boolean, deps: DependencyList) => {
  const [formWarning, setFormWarning] = useAtom(FormDiscardWarningAtom);
  useEffect(() => {
    return () => {
      setFormWarning(false);
    };
  }, [setFormWarning]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isModified = useMemo(() => isModify(), deps);

  useIsomorphicLayoutEffect(() => {
    if (isModified) {
      setFormWarning(true);
    } else {
      setFormWarning(false);
    }
  }, [isModified, setFormWarning]);

  useBeforeUnload(isModified, '您的表单未保存，确定要离开吗？');

  return [formWarning, setFormWarning] as const;
};
