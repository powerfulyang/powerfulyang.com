import React, { FC } from 'react';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Button } from '@/components/Button';
import { Icon } from '@powerfulyang/components';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Post } from '@/types/Post';
import { DateFormat } from '@/utils/Utils';
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
      <body className={styles.body}>
        <figure className={styles.home_bg}>
          <section className={styles.blog_desc_section}>
            <Button className={styles.blog_title}>萝卜の小窝</Button>
            <div className={styles.blog_desc}>
              <div className={styles.bio}>一生悬命じゃないかしら</div>
              <div className={styles.social_media}>
                <a href="https://twitter.com/hutyxxx" target="_blank" rel="noreferrer">
                  <Icon className={styles.twitter} type="icon-twitter" />
                </a>
                <a href="https://github.com/powerfulyang" target="_blank" rel="noreferrer">
                  <Icon className={styles.github} type="icon-github" />
                </a>
                <a href="https://instagram.com/powerfulyang" target="_blank" rel="noreferrer">
                  <Icon className={styles.instagram} type="icon-instagram" />
                </a>
              </div>
            </div>
          </section>
        </figure>
        <main className={styles.main}>
          {posts.map((post) => {
            return (
              <article className={styles.article} key={post.id}>
                <span>{post.title}</span>
                <span className="pl-8 text-blueGray-500">{DateFormat(post.createAt)}</span>
              </article>
            );
          })}
          <footer className="text-center py-8">
            <span className="mr-2">备案号</span>
            <a
              className="text-emerald-500"
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer"
            >
              粤ICP备19128686号-1
            </a>
            <span className="ml-8">被{pathViewCount}人临幸</span>
          </footer>
        </main>
      </body>
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
