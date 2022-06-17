import type { GetServerSideProps } from 'next';
import { requestAtServer } from '@/utils/server';
import type { Post } from '@/type/Post';
import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await requestAtServer('/public/post', {
    ctx,
  });

  const json = await res.json();
  const { data } = json;

  return getServerSideSitemap(
    ctx,
    data.map((post: Post) => {
      return {
        loc: `https://powerfulyang.com/post/${post.id}`,
        lastmod: post.createAt,
        changefreq: 'daily',
        priority: 0.8,
      };
    }),
  );
};

// Default export to prevent next.js errors
export default function SitemapIndex() {}
