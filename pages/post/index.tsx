import React from 'react';
import { GetServerSidePropsContext } from 'next';
import classNames from 'classnames';
import { constants } from 'http2';
import { request } from '@/utils/request';
import { Post } from '@/types/Post';
import { Link } from '@/components/Link';
import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { DateFormat } from '@/utils/lib';
import { Clock } from '@/components/Clock';
import styles from './index.module.scss';

type IndexProps = {
  posts: Post[];
  years: number[];
  year: number;
};

const Index: LayoutFC<IndexProps> = ({ posts, years, year }) => {
  return (
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
          {posts.map((post) => {
            return (
              <Link key={post.id} to={`/post/${post.id}`}>
                <div className="bg-white rounded-xl shadow-lg my-8 overflow-hidden">
                  <div className="pointer w-full h-[16rem] overflow-hidden">
                    <img
                      src={post.poster.objectUrl}
                      alt=""
                      className="object-cover w-full h-full hover:scale-110 transition-all duration-300"
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
            );
          })}
        </section>
      </main>
    </div>
  );
};

Index.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  let isPublic = true;
  const t = await request('/user/current', { ctx });
  if (t.status === constants.HTTP_STATUS_OK) {
    isPublic = false;
  }
  const tmp = await request(isPublic ? '/public/post/years' : '/post/years', {
    ctx,
  });
  let { data: years } = await tmp.json();
  years = years.reverse();
  const year = query.year || years[0];
  const res = await request(isPublic ? '/public/post' : '/post', {
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
