import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

export const NoSSRLiveMarkdownEditor = dynamic(
  () => import('./index').then((r) => r.LiveMarkdownEditor),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);
