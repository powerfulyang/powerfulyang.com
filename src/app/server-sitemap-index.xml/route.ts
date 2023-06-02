import type { Post } from '@/__generated__/api';
import { serverApi } from '@/request/requestTool';
import { formatDateTime } from '@/utils/lib';
import { getServerSideSitemap } from 'next-sitemap';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const _posts = await serverApi.queryPublicPosts(
    {},
    {
      headers: request.headers,
    },
  );
  const years = await serverApi.queryPublicPostYears({
    headers: request.headers,
  });
  const { data: postsData } = _posts;
  const { data: yearsData } = years;

  const posts = postsData.map((post: Post) => {
    return {
      loc: `https://powerfulyang.com/post/${post.id}`,
      lastmod: formatDateTime(post.updatedAt),
      changefreq: 'daily',
      priority: 0.8,
    } as const;
  });

  const postYears = yearsData.map((year) => {
    return {
      loc: `https://powerfulyang.com/post/year/${year.publishYear}`,
      lastmod: formatDateTime(year.updatedAt),
      changefreq: 'daily',
      priority: 0.8,
    } as const;
  });

  const homePage = {
    loc: 'https://powerfulyang.com/',
    lastmod: formatDateTime(postsData[0]?.updatedAt),
    changefreq: 'daily',
    priority: 0.8,
  } as const;

  return getServerSideSitemap([homePage, ...posts, ...postYears]);
}
