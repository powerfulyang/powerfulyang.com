import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { RedirectingAtom } from '@/components/Redirecting';
import { FormDiscardWarningAtom } from '@/hooks/useFormDiscardWarning';
import { useLatest } from '@powerfulyang/hooks';

export const useHistory = () => {
  const router = useRouter();
  const [, setIsRedirecting] = useAtom(RedirectingAtom);
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
  }, [router, confirm]);

  const pushState = useCallback(
    async (...args: Parameters<typeof router.push>) => {
      const bool = confirm();
      if (bool) {
        setIsRedirecting(true);
        try {
          return await router.push(...args);
        } finally {
          setIsRedirecting(false);
        }
      }
      return false;
    },
    [confirm, router, setIsRedirecting],
  );

  return { pushState, replaceState: router.replace, pathname: router.pathname, router };
};
