import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

export const NoSSRMonacoEditor = dynamic(() => import('./editor'), {
  ssr: false,
  loading: () => <Loading />,
});
