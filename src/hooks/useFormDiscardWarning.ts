import { useBeforeUnload } from '@powerfulyang/hooks';
import { useIsomorphicLayoutEffect } from 'framer-motion';
import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/router';
import type { DependencyList } from 'react';
import { useEffect, useMemo } from 'react';

export const FormDiscardWarningAtom = atom(false);

export const useFormRouteListener = () => {
  const router = useRouter();
  const [formWarning] = useAtom(FormDiscardWarningAtom);

  useEffect(() => {
    const confirm = () => {
      if (formWarning) {
        // eslint-disable-next-line no-alert
        return window.confirm('您的表单未保存，确定要离开吗？');
      }
      return true;
    };
    const handleRouteChangeStart = async (url: string) => {
      if (url !== router.asPath) {
        const bool = confirm();
        if (!bool) {
          await router.replace(router.asPath);
        }
      }
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.beforePopState((state) => {
      if (state.as !== router.asPath) {
        const bool = confirm();
        if (!bool) {
          queueMicrotask(() => {
            // fixme 暂时只实现了，阻止返回，没有实现阻止前进
            router.forward();
          });
          return false;
        }
      }
      return true;
    });

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.beforePopState(() => true);
    };
  }, [formWarning, router]);
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
