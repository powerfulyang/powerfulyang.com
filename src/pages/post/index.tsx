import React from 'react';
import type { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { request } from '@/utils/request';
import type { Post } from '@/type/Post';
import { Link } from '@/components/Link';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { CosUtils, DateFormat } from '@/utils/lib';
import styles from './index.module.scss';
import { LazyImage } from '@/components/LazyImage';
import { getCurrentUser } from '@/service/getCurrentUser';

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year }) => {
  return (
    <div className={styles.body}>
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
        <section className="mt-6">
          {posts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`}>
              <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
                <div className="h-[12rem] sm:h-[18rem] rounded-t-xl overflow-hidden">
                  <LazyImage
                    containerClassName="h-full scale-100 md:hover:scale-110 transition-all duration-500"
                    src={CosUtils.getCosObjectUrl(post.poster.objectUrl)}
                    blurSrc={CosUtils.getCosObjectBlurUrl(post.poster.objectUrl)}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="inline-block text-base whitespace-nowrap px-4 my-2 text-blue-400 font-normal">
                    {DateFormat(post.createAt)}
                  </span>
                  <span title={post.title} className={classNames('flex items-center mb-2')}>
                    <div className="line-1-ellipsis text-blue-400">
                      <span className={styles.articleTitle}>{post.title}</span>
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
};

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
