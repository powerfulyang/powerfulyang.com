import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { isEmpty } from '@powerfulyang/utils';

const FormDiscardWarningAtom = atom(false);

// 使用全局变量会导致 组件被卸载后 没有回到初始值 导致异常
export const useFormDiscardWarning = (fields?: any) => {
  const [formWarning, setFormWarning] = useAtom(FormDiscardWarningAtom);
  useEffect(() => {
    return () => {
      setFormWarning(false);
    };
  }, [setFormWarning]);

  useEffect(() => {
    if (fields) {
      const result = Object.values(fields).some((field) => !isEmpty(field));
      setFormWarning(result);
    }
  }, [fields, setFormWarning]);

  return [formWarning, setFormWarning] as const;
};
