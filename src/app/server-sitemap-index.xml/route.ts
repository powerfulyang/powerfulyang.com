import { getServerSideSitemap } from 'next-sitemap';
import type { NextRequest } from 'next/server';
import type { Post } from '@/__generated__/api';
import { serverApi } from '@/request/requestTool';

export async function GET(request: NextRequest) {
  const posts = await serverApi.queryPublicPosts(
    {},
    {
      headers: request.headers,
    },
  );
  const { data: postsData } = posts;

  const postsMaps = postsData.map((post: Post) => {
    return {
      loc: `https://powerfulyang.com/post/${post.id}`,
      lastmod: post.updatedAt,
      changefreq: 'daily',
      priority: 0.8,
    } as const;
  });

  const homePage = {
    loc: 'https://powerfulyang.com',
    lastmod: postsData[0]?.updatedAt,
    changefreq: 'daily',
    priority: 0.8,
  } as const;

  return getServerSideSitemap([homePage, ...postsMaps]);
}
