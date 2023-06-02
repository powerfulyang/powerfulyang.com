import type { Post } from '@/__generated__/api';
import { origin } from '@/components/Head';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { UserLayout } from '@/layout/UserLayout';
import { serverApi } from '@/request/requestTool';
import type { LayoutFC } from '@/type/GlobalContext';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
import { formatDateTime } from '@/utils/lib';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import styles from './index.module.scss';

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year }) => {
  const router = useRouter();

  useHotkeys(
    '., 。',
    () => {
      return router.push('/post/publish');
    },
    [router],
  );

  return (
    <main className={styles.main}>
      <div className={classNames(styles.years)} role="tablist">
        {years.map((x) => (
          <Link role="tab" key={x} href={`/post/year/${x}`}>
            <span
              className={classNames(styles.year, 'pr-1', {
                [styles.active]: x === year,
              })}
            >
              #{x}
            </span>
          </Link>
        ))}
      </div>
      <section className="m-auto flex w-[100%] max-w-[1000px] flex-col">
        {posts.map((post) => (
          <motion.a
            key={post.id}
            title={`${post.id}`}
            className={classNames('pointer', styles.card)}
            href={`/post/${post.id}`}
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey) {
                return null;
              }
              e.preventDefault();
              return router.push(`/post/${post.id}`);
            }}
          >
            <LazyAssetImage
              containerClassName={styles.bg}
              thumbnail="poster"
              draggable={false}
              asset={post.poster}
            />
            <h2>{post.title}</h2>
            <summary>{post.summary}</summary>
            <section className="leading-6 text-gray-400">
              <span>Date: {formatDateTime(post.createdAt)}</span>
              <br />
              <span>Author: {post.createBy.nickname}</span>
            </section>
          </motion.a>
        ))}
      </section>
    </main>
  );
};

Index.getLayout = (page) => {
  const { pathViewCount } = page.props.layout;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;

  const requestHeaders = extractRequestHeaders(ctx.req.headers);

  const { data: years } = await serverApi.queryPublicPostYears({
    headers: requestHeaders,
  });
  const year: number = Number(query.year) || years[0].publishYear || new Date().getFullYear();
  const res = await serverApi.queryPublicPosts(
    {
      publishYear: year,
    },
    {
      headers: requestHeaders,
    },
  );
  const pathViewCount = res.headers.get('x-path-view-count');
  const { data } = res;
  return {
    props: {
      years: years.map((x) => x.publishYear),
      posts: data,
      year,
      layout: {
        pathViewCount,
      },
      meta: {
        title: `日志 - ${year}`,
        description: `发布于 ${year} 年的日志`,
      },
      link: {
        canonical: `${origin}/post/year/${year}`,
      },
    },
  };
};

export default Index;
