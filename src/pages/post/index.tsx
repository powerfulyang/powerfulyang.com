import React from 'react';
import type { GetServerSideProps } from 'next';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import type { Post } from '@/type/Post';
import { Link } from '@/components/Link';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { useHistory } from '@/hooks/useHistory';
import { requestAtServer } from '@/utils/server';
import { useHotkeys } from 'react-hotkeys-hook';
import { useFixMinHeight } from '@/hooks/useFixMinHeight';
import { DateTimeFormat } from '@/utils/lib';
import { defaultAuthor, origin } from '@/components/Head';
import styles from './index.module.scss';

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year }) => {
  const history = useHistory();

  useHotkeys(
    '., 。',
    () => {
      return history.pushState('/post/publish');
    },
    [history],
  );

  useFixMinHeight();

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
              return history.pushState(`/post/${post.id}`);
            }}
          >
            <LazyAssetImage
              containerClassName={styles.bg}
              thumbnail={700}
              draggable={false}
              asset={post.poster}
            />
            <h2>{post.title}</h2>
            <summary>{post.summary}</summary>
            <section className="leading-6 text-gray-400">
              <span>Date: {DateTimeFormat(post.createAt)}</span>
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
  const tmp = await requestAtServer('/public/post/years', {
    ctx,
  });
  const years = await tmp.json();
  const year: number = Number(query.year) || years[0] || new Date().getFullYear();
  const res = await requestAtServer('/public/post', {
    ctx,
    query: { publishYear: year },
  });
  const pathViewCount = res.headers.get('x-path-view-count');
  const data = await res.json();
  return {
    props: {
      years,
      posts: data,
      year,
      layout: {
        pathViewCount,
      },
      meta: {
        title: `日志 - ${year}`,
        description: `发布于 ${year} 年的日志`,
        author: defaultAuthor,
        keywords: `日志, 记录, ${year}`,
      },
      link: {
        canonical: `${origin}/post/year/${year}`,
      },
    },
  };
};

export default Index;
