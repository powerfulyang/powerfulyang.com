import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Post } from '@/types/Post';
import { Link } from '@/components/Link';
import { groupBy } from 'ramda';
import classNames from 'classnames';
import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { DateFormat } from '@/utils/lib';
import styles from './index.module.scss';

type IndexProps = {
  data: {
    posts: Post[];
  };
  years: number[];
  year: number;
};

const Index: LayoutFC<IndexProps> = ({ data: { posts }, years, year }) => {
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
        <section className={classNames(styles.titles, 'mt-4')}>
          {posts.map((post) => {
            return (
              <div key={post.id} className="flex items-center">
                <span className="inline-block text-pink-400 w-32 whitespace-nowrap">
                  {DateFormat(post.createAt)}
                </span>
                <Link className={classNames(styles.article_title)} to={`/post/${post.id}`}>
                  {post.title}
                </Link>
              </div>
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
  const res = await request('/posts', { ctx });
  const { data, pathViewCount } = await res.json();
  const { posts } = data;
  const groupedPosts = groupBy(
    (post: any) => new Date(post.createAt).getFullYear().toString(),
    posts,
  );
  const years = Object.keys(groupedPosts).sort((m, n) => Number(n) - Number(m));
  const { year = years[0] } = query;
  return {
    props: {
      data: {
        posts: groupedPosts[year as any],
      },
      years,
      year,
      pathViewCount,
    },
  };
};

export default Index;
