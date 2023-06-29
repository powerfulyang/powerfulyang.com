import dynamic from 'next/dynamic';

export const NoSSRLiveMarkdownEditor = dynamic(
  () => import('./index').then((r) => r.LiveMarkdownEditor),
  {
    ssr: false,
    loading: () => <div className="flex h-full w-full items-center justify-center">Loading...</div>,
  },
);
