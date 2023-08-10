import { headers } from 'next/headers';
import { Timeline } from '@/app/app_timeline/timeline';
import { serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';

const Page = async () => {
  const res = await serverApi.infiniteQueryPublicTimeline(
    {
      take: 10,
    },
    {
      headers: extractRequestHeaders(headers()),
    },
  );
  const { resources: feeds, nextCursor, prevCursor } = res.data;

  return <Timeline feeds={feeds} nextCursor={nextCursor} prevCursor={prevCursor} />;
};

export default Page;
