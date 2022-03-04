import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { RedirectingAtom } from '@/components/Redirecting';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';

/**
 * form 锁
 */

export const useHistory = () => {
  const router = useRouter();
  const [, setIsRedirecting] = useAtom(RedirectingAtom);
  const [formWarning] = useFormDiscardWarning();
  const pushState = useCallback(
    (url: string) => {
      const push = () => {
        setIsRedirecting(true);
        router.push(url).finally(() => {
          setIsRedirecting(false);
        });
      };
      if (formWarning) {
        // eslint-disable-next-line no-alert
        const bool = window.confirm('还有内容没有提交确定要离开吗？');
        if (bool) {
          push();
        }
      } else {
        push();
      }
    },
    [formWarning, router, setIsRedirecting],
  );
  return { pushState, replaceState: router.replace, pathname: router.pathname };
};
