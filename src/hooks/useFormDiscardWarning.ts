import { atom, useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useBeforeUnload } from '@powerfulyang/hooks';

export const FormDiscardWarningAtom = atom(false);

export const useFormDiscardWarning = (isModify: () => boolean) => {
  const [formWarning, setFormWarning] = useAtom(FormDiscardWarningAtom);
  useEffect(() => {
    return () => {
      setFormWarning(false);
    };
  }, [setFormWarning]);

  const isModified = useMemo(isModify, [isModify]);
  useEffect(() => {
    if (isModified) {
      setFormWarning(true);
    } else {
      setFormWarning(false);
    }
  }, [isModified, setFormWarning]);

  useBeforeUnload(isModified, '您的表单未保存，确定要离开吗？');

  return [formWarning, setFormWarning] as const;
};
