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
        <section className={classNames(styles.titles, 'mt-4')}>
          {posts.map((post) => {
            return (
              <div key={post.id} className="bg-white rounded-xl shadow-xl my-8">
                <div className="pointer w-full h-[10rem] overflow-hidden">
                  <img
                    src="https://post-1253520329.cos.ap-shanghai.myqcloud.com/1b92da6605fc7fbabc6d68d61baf1ee13d3acaf6.png?q-sign-algorithm=sha1&q-ak=AKIDjMo5DCRjFbMxOn687vmjYEj7KNFwLp0z&q-sign-time=1631005912;1631092312&q-key-time=1631005912;1631092312&q-header-list=host&q-url-param-list=&q-signature=5045ecea379b33bd115b349a0f04424aeb899f28"
                    alt=""
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex items-center h-[4rem]">
                  <Link
                    className={classNames(styles.article_title, 'flex-1')}
                    to={`/post/${post.id}`}
                  >
                    {post.title}
                  </Link>
                  <span className="inline-block text-pink-400 whitespace-nowrap w-28 text-right mr-4">
                    {DateFormat(post.createAt)}
                  </span>
                </div>
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
    },
  };
};

export default Index;
