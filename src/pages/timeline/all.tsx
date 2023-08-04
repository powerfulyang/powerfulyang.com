import type { GetServerSideProps } from 'next';
import { Timeline } from '@/pages/timeline';
import { origin } from '@/components/Head';
import { serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await serverApi.infiniteQueryPublicTimeline(
    {},
    {
      headers: extractRequestHeaders(ctx.req.headers),
    },
  );
  const pathViewCount = res.headers.get('x-path-view-count');
  const { data } = res;
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
