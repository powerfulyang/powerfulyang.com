import type { Post } from '@/type/Post';
import type { NextRequest } from 'next/server';
import { requestAtServer } from '@/utils/server';
import { getServerSideSitemap } from 'next-sitemap';

export async function GET(request: NextRequest) {
  const res = await requestAtServer('/public/post', {
    headers: request.headers,
  });
  const data = await res.json();
  return getServerSideSitemap(
    data.map((post: Post) => {
      return {
        loc: `https://powerfulyang.com/post/${post.id}`,
        lastmod: post.updateAt,
        changefreq: 'daily',
        priority: 0.8,
      };
    }),
  );
}
