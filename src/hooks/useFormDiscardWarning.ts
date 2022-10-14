import { atom, useAtom } from 'jotai';
import type { DependencyList } from 'react';
import { useEffect, useMemo } from 'react';
import { useBeforeUnload } from '@powerfulyang/hooks';
import { useIsomorphicLayoutEffect } from 'framer-motion';

export const FormDiscardWarningAtom = atom(false);

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
