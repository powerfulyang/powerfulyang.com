import React, { FC } from 'react';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Button } from '@/components/Button';
import { Icon, Tooltip } from '@powerfulyang/components';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Post } from '@/types/Post';
import { DateFormat } from '@/utils/Utils';
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
            <Button className={styles.blog_title}>{`< #萝卜の小窝# >`}</Button>
          </section>
          <div className={styles.years}>
            {years.map((x) => (
              <Link key={x} to={`?year=${x}`}>
                <span
                  className={classNames(styles.year, {
                    [styles.active]: x === year,
                  })}
                >
                  #{x}
                </span>
              </Link>
            ))}
          </div>
          <div className={styles.posts}>
            {posts.map((post) => {
              return (
                <article className={styles.article} key={post.id}>
                  <Tooltip title={post.title}>
                    <span className="inline-block w-2/3 overflow-ellipsis">
                      <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </span>
                  </Tooltip>
                  <span className="pl-2 sm:pl-8 inline-block">{DateFormat(post.createAt)}</span>
                </article>
              );
            })}
          </div>
        </main>
        <footer className="text-center w-full absolute bottom-10 left-1/2 transform -translate-x-1/2">
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
          <section className="text-blueGray-400">
            © {new Date().getFullYear()} Power by
            <a
              href="https://github.com/powerfulyang/powerfulyang.com"
              target="_blank"
              rel="noreferrer"
              className="ml-2 text-blue-200"
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
