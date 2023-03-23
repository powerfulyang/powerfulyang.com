import { ProjectName } from '@/constant/Constant';
import { Feed } from 'feed';
import type { NextRequest } from 'next/server';
import type { Post } from '@/__generated__/api';
import { serverApi } from '@/request/requestTool';

const generateRssFeed = (posts: Post[]) => {
  const site_url = 'https://powerfulyang.com';

  const feedOptions = {
    title: ProjectName,
    description: `Welcome to powerfulyang's blog posts!`,
    copyright: `All rights reserved ${new Date().getFullYear()}, powerfulyang`,
    id: site_url,
    link: site_url,
    generator: 'Feed for Node.js',
  };

  const feed = new Feed(feedOptions);
  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      description: post.summary,
      id: `${site_url}/post/${post.id}`,
      link: `${site_url}/post/${post.id}`,
      date: new Date(post.updatedAt),
      published: new Date(post.createdAt),
    });
  });

  return feed.rss2();
};

export async function GET(request: NextRequest) {
  const res = await serverApi.queryPublicPosts(
    {},
    {
      headers: request.headers,
    },
  );

  const rssFeed = generateRssFeed(res.data);

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
    },
  });
}
