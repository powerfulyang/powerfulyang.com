import { headers } from 'next/headers';
import { serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
import { Gallery } from './gallery';

const Page = async () => {
  const res = await serverApi.infiniteQueryPublicAsset(
    {
      take: 20,
    },
    {
      headers: extractRequestHeaders(headers()),
    },
  );
  const { resources: assets, nextCursor, prevCursor } = res.data;

  return <Gallery assets={assets} prevCursor={prevCursor} nextCursor={nextCursor} />;
};

export default Page;
