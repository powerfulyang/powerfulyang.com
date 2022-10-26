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
import { BackToTop } from '@/components/BackToTop';
import Lottie from 'lottie-react';
import CuteUnicorn from '@/lottie/CuteUnicorn.json';
import { useFixMinHeight } from '@/hooks/useFixMinHeight';
import { DateTimeFormat } from '@/utils/lib';
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
      history.pushState('/post/publish');
    },
    [history],
  );

  useFixMinHeight();

  return (
    <>
      <main className={styles.main}>
        <div className={classNames(styles.years)} role="tablist">
          {years.map((x) => (
            <Link role="tab" key={x} href={`?year=${x}`}>
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
              href={`/post/${post.urlTitle}`}
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  return null;
                }
                e.preventDefault();
                return history.pushState(`/post/${post.urlTitle}`);
              }}
            >
              <LazyAssetImage
                containerClassName="h-[200px] w-[320px] object-cover rounded-lg"
                thumbnail={700}
                draggable={false}
                asset={post.poster}
              />
              <div className="ml-6 flex w-[480px] flex-col justify-around">
                <h2>{post.title}</h2>
                <summary>{post.content}</summary>
                <section className="divide-x divide-gray-200 text-gray-600">
                  <span className="px-4">{post.createBy.nickname}</span>
                  <span className="px-4">{DateTimeFormat(post.createAt)}</span>
                </section>
              </div>
            </motion.a>
          ))}
        </section>
      </main>
      <BackToTop />
      <Lottie
        className="fixed left-10 bottom-28 hidden w-44 sm:block"
        animationData={CuteUnicorn}
      />
    </>
  );
};

Index.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const tmp = await requestAtServer('/public/post/years', {
    ctx,
  });
  const { data: years = [] } = await tmp.json();
  const year = Number(query.year) || years[0] || new Date().getFullYear();
  const res = await requestAtServer('/public/post', {
    ctx,
    query: { publishYear: year },
  });
  const { data, pathViewCount } = await res.json();
  return {
    props: {
      pathViewCount,
      years,
      posts: data,
      year,
      title: '日志',
    },
  };
};

export default Index;
