import { Timeline } from '@/pages/timeline';
import type { GetServerSideProps } from 'next';
import { requestAtServer } from '@/utils/server';
import { origin } from '@/components/Head';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await requestAtServer('/public/feed', {
    ctx,
  });
  const pathViewCount = res.headers.get('x-path-view-count');
  const data = await res.json();
  return {
    props: {
      feeds: data.resources,
      nextCursor: data.nextCursor,
      prevCursor: data.prevCursor,
      meta: {
        title: '全部说说',
        description: '关于我日常的胡言乱语，一页可见',
      },
      layout: {
        pathViewCount,
      },
      link: {
        canonical: `${origin}/timeline/all`,
      },
    },
  };
};

export default Timeline;
