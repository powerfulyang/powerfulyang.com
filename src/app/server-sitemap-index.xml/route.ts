import { getServerSideSitemapIndex } from 'next-sitemap';
import type { Post } from '@/type/Post';
import type { NextRequest } from 'next/server';
import { requestAtServer } from '@/utils/server';

export async function GET(request: NextRequest) {
  const res = await requestAtServer('/public/post', {
    headers: request.headers,
  });
  const data = await res.json();
  return getServerSideSitemapIndex(
    data.map((post: Post) => {
      return `https://powerfulyang.com/post/${post.id}`;
    }),
  );
}
