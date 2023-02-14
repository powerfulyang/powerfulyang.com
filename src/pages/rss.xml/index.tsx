import type { GetServerSideProps } from 'next';
import { requestAtServer } from '@/utils/server';
import { Feed } from 'feed';
import { ProjectName } from '@/constant/Constant';
import type { Post } from '@/type/Post';

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
      date: new Date(post.createAt),
    });
  });

  return feed.rss2();
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await requestAtServer('/public/post', {
    ctx,
  });

  const data = (await res.json()) as Post[];

  const rssFeed = generateRssFeed(data);

  ctx.res.setHeader('Content-Type', 'text/xml');
  ctx.res.write(rssFeed);
  ctx.res.end();
  return {
    props: {},
  };
};

// Default export to prevent next.js errors
export default function FeedXml() {}
