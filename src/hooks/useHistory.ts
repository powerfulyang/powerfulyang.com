import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { RedirectingAtom } from '@/components/Redirecting';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';

export const useHistory = () => {
  const router = useRouter();
  const [, setIsRedirecting] = useAtom(RedirectingAtom);
  const [formWarning] = useFormDiscardWarning();
  const confirm = useCallback(
    <T extends Function, P extends Function>(ok?: T, fail?: P) => {
      if (formWarning) {
        // eslint-disable-next-line no-alert
        const bool = window.confirm('还有内容没有提交确定要离开吗？');
        if (bool) {
          return ok?.() || true;
        }
        return fail?.() || false;
      }
      return ok?.() || true;
    },
    [formWarning],
  );
  useEffect(() => {
    router.beforePopState(() => {
      return confirm(); // TODO 不应该改路由地址，现在是会改掉
    });
  }, [formWarning, router, confirm]);
  const pushState = useCallback(
    (...args: Parameters<typeof router.push>) => {
      const push = () => {
        setIsRedirecting(true);
        router.push(args[0], args[1], args[2]).finally(() => {
          setIsRedirecting(false);
        });
      };
      confirm(push);
    },
    [confirm, router, setIsRedirecting],
  );
  return { pushState, replaceState: router.replace, pathname: router.pathname, router };
};
