import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { RedirectingAtom } from '@/components/Redirecting';
import { useFormDiscardWarning } from '@/hooks/useFormDiscardWarning';

export const useHistory = () => {
  const router = useRouter();
  const [, setIsRedirecting] = useAtom(RedirectingAtom);
  const [formWarning] = useFormDiscardWarning();
  const pushState = useCallback(
    (...args: Parameters<typeof router.push>) => {
      const push = () => {
        setIsRedirecting(true);
        router.push(args[0], args[1], { scroll: false, ...args[2] }).finally(() => {
          setIsRedirecting(false);
          // 使用 History.scrollRestoration 来使滚动条回到顶部 但是会使 nav=>layoutId 计算出现错误
          window.scrollTo({
            behavior: 'smooth',
            top: 0,
          });
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
  return { pushState, replaceState: router.replace, pathname: router.pathname, router };
};
