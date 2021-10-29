import React from 'react';
import type { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { request } from '@/utils/request';
import type { Post } from '@/type/Post';
import { Link } from '@/components/Link';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { CosUtils, DateFormat } from '@/utils/lib';
import { Clock } from '@/components/Clock';
import styles from './index.module.scss';
import { LazyImage } from '@/components/LazyImage';
import { getCurrentUser } from '@/service/getCurrentUser';

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year }) => (
  <div className={styles.body}>
    <Clock />
    <main className={styles.main}>
      <div className={styles.years}>
        {years.map((x) => (
          <Link key={x} to={`?year=${x}`}>
            <span className={classNames(styles.year)}>
              <span
                className={classNames('pr-1', {
                  [`text-lg ${styles.active}`]: x === year,
                })}
              >
                #{x}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <section className={classNames('mt-4')}>
        {posts.map((post) => (
          <Link key={post.id} to={`/post/${post.id}`}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-[16rem] overflow-hidden">
                <LazyImage
                  className="h-[16rem] scale-100 md:hover:scale-110 transition-all duration-500"
                  src={CosUtils.getCosObjectUrl(post.poster.objectUrl)}
                  blurSrc={CosUtils.getCosObjectBlurUrl(post.poster.objectUrl)}
                />
              </div>
              <div className="flex h-[6rem] flex-col justify-evenly">
                <span className="inline-block text-base whitespace-nowrap px-4 text-blue-400 font-normal">
                  {DateFormat(post.createAt)}
                </span>
                <span title={post.title} className={classNames('flex items-center')}>
                  <div className="line-1-ellipsis text-blue-400">
                    <span className={styles.article_title}>{post.title}</span>
                  </div>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  </div>
);

Index.getLayout = (page) => {
  const { pathViewCount, user } = page.props;
  return (
    <UserLayout user={user} pathViewCount={pathViewCount}>
      {page}
    </UserLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  const tmp = await request('/public/post/years', {
    ctx,
  });
  let { data: years = [] } = await tmp.json();
  years = years.reverse();
  const year = query.year || years[0];
  const res = await request('/public/post', {
    ctx,
    query: { publishYear: year },
  });
  const { data, pathViewCount } = await res.json();
  const user = await getCurrentUser(ctx);
  return {
    props: {
      pathViewCount,
      years,
      posts: data,
      year,
      title: '日志',
      user,
    },
  };
};

export default Index;
