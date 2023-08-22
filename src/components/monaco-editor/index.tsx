import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

export const NoSSRMarkdownEditor = dynamic(() => import('./editor'), {
  ssr: false,
  loading: () => <Loading />,
});
