import type { NextRequest } from 'next/server';
import { requestAtServer } from '@/utils/server';
import { getServerSideSitemap } from 'next-sitemap';
import type { Post } from '@/__generated__/api';

export async function GET(request: NextRequest) {
  const res = await requestAtServer('/public/post', {
    headers: request.headers,
  });
  const data = await res.json();
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
