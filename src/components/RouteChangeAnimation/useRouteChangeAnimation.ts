import { ChangingAtom } from '@/components/RouteChangeAnimation/changingAtom';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * @description 路由变化时，出现顶部动画
 * @description 路由变化时，如果表单未保存，出现提示
 */
export const useRouteChangeAnimation = () => {
  const router = useRouter();
  const [, setIsChanging] = useAtom(ChangingAtom);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsChanging(true);
    };
    const handleRouteChangeComplete = () => {
      setIsChanging(false);
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router, setIsChanging]);
};
