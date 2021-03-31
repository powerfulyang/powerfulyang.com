import React, { FC } from 'react';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Button } from '@/components/Button';
import { Icon } from '@powerfulyang/components';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Post } from '@/types/Post';
import { DateFormat } from '@/utils/Utils';
import { Link } from '@/components/Link';
import styles from './index.module.scss';

type IndexProps = {
  data: {
    posts: Post[];
    pathViewCount: number;
  };
};

const Index: FC<IndexProps> = ({ data: { posts, pathViewCount } }) => {
  return (
    <GlobalContextProvider>
      <Header />
      <div className={styles.body}>
        <figure className={styles.home_bg}>
          <section className={styles.blog_desc_section}>
            <Button className={styles.blog_title}>{`< #萝卜の小窝# >`}</Button>
          </section>
        </figure>
        <main className={styles.main}>
          {posts.map((post) => {
            return (
              <article className={styles.article} key={post.id}>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
                <span className="pl-8">{DateFormat(post.createAt)}</span>
              </article>
            );
          })}
          <footer className="text-center py-8">
            <span className="mr-1">备案号:</span>
            <a
              className="text-emerald-500"
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer"
            >
              粤ICP备19128686号-1
            </a>
            <span className="ml-8">被{pathViewCount}人临幸</span>
            <span className="ml-8">
              <span className="mr-1">LINK:</span>
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
          </footer>
        </main>
      </div>
    </GlobalContextProvider>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request('/posts', { ctx });
  const { data } = await res.json();
  return {
    props: { data },
  };
};

export default Index;
