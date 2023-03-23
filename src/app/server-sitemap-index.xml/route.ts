import type { NextRequest } from 'next/server';
import { getServerSideSitemap } from 'next-sitemap';
import type { Post } from '@/__generated__/api';
import { serverApi } from '@/request/requestTool';

export async function GET(request: NextRequest) {
  const res = await serverApi.queryPublicPosts(
    {},
    {
      headers: request.headers,
    },
  );
  const { data } = res;
  return getServerSideSitemap(
    data.map((post: Post) => {
      return {
        loc: `https://powerfulyang.com/post/${post.id}`,
        lastmod: post.updatedAt,
        changefreq: 'daily',
        priority: 0.8,
      };
    }),
  );
}
