import { Timeline } from '@/pages/timeline';
import type { GetServerSideProps } from 'next';
import { requestAtServer } from '@/utils/server';

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
      pathViewCount,
      title: '说说',
    },
  };
};

export default Timeline;
