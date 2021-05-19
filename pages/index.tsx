import React, { FC } from 'react';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Icon } from '@powerfulyang/components';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Post } from '@/types/Post';
import { Link } from '@/components/Link';
import { groupBy } from 'ramda';
import classNames from 'classnames';
import styles from './index.module.scss';

type IndexProps = {
  data: {
    posts: Post[];
    pathViewCount: number;
  };
  years: number[];
  year: number;
};

const Index: FC<IndexProps> = ({ data: { posts, pathViewCount }, years, year }) => {
  return (
    <GlobalContextProvider>
      <Header />
      <div className={styles.body}>
        <main className={styles.main}>
          <section className={styles.blog_desc_section}>
            <div className={styles.blog_title}>{`< #萝卜の小窝# >`}</div>
          </section>
          <div className={styles.years}>
            {years.map((x) => (
              <Link key={x} to={`?year=${x}`}>
                <span className={classNames(styles.year)}>
                  <span
                    className={classNames('pr-1', {
                      [`text-xl ${styles.active}`]: x === year,
                    })}
                  >
                    #
                  </span>
                  {x}
                </span>
              </Link>
            ))}
          </div>
          <section className={styles.titles}>
            {posts.map((post) => {
              return (
                <div className={classNames(styles.article_title)} key={post.id}>
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </div>
              );
            })}
          </section>
        </main>
        <footer className="text-center absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 p-4 rounded-xl w-4/5 sm:w-auto">
          <section className="text-blueGray-400">
            <span className="mr-1">备案号:</span>
            <a
              className="text-emerald-500"
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer"
            >
              粤ICP备19128686号-1
            </a>
            <span className="ml-8 hidden sm:inline-block">被{pathViewCount}人临幸</span>
            <span className="ml-8">
              <a
                className="mr-1"
                href="https://twitter.com/hutyxxx"
                target="_blank"
                rel="noreferrer"
              >
                <Icon className={styles.twitter} type="icon-twitter" />
              </a>
              <a
                className="mr-1"
                href="https://github.com/powerfulyang"
                target="_blank"
                rel="noreferrer"
              >
                <Icon className={styles.github} type="icon-github" />
              </a>
              <a href="https://instagram.com/powerfulyang" target="_blank" rel="noreferrer">
                <Icon className={styles.instagram} type="icon-instagram" />
              </a>
            </span>
          </section>
          <section className="text-white">
            © {new Date().getFullYear()} Power by
            <a
              href="https://github.com/powerfulyang/powerfulyang.com"
              target="_blank"
              rel="noreferrer"
              className="ml-2 pt-4 text-yellow-200 sm:text-green-400"
            >
              powerfulyang
            </a>
          </section>
        </footer>
      </div>
    </GlobalContextProvider>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  const res = await request('/posts', { ctx });
  const { data } = await res.json();
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
        pathViewCount: data.pathViewCount,
      },
      years,
      year,
    },
  };
};

export default Index;
