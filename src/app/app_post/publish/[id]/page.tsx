import { isString } from '@powerfulyang/utils';
import type { FC } from 'react';
import { headers } from 'next/headers';
import type { Post } from '@/__generated__/api';
import { serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
import { Publish } from './publish';

export type Params = {
  params: {
    id: string;
  };
};

const Page: FC<Params> = async ({ params: { id } }) => {
  let post;
  if (isString(id) && id !== '0') {
    const res = await serverApi.queryPublicPostById(
      Number(id),
      {
        versions: [],
      },
      {
        headers: extractRequestHeaders(headers()),
      },
    );
    post = res.data;
  } else {
    post = {} as Partial<Post>;
  }

  return <Publish post={post} />;
};

export default Page;
