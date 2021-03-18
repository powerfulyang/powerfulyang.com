import React, { FC } from 'react';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import styles from './index.module.scss';

const Index: FC = () => {
  return (
    <GlobalContextProvider>
      <Header />
      <figure className={styles.home_bg}>
        <section className={styles.blog_desc_section}>
          <div className={styles.blog_title}>萝卜的小窝</div>
          <div className={styles.blog_desc}>
            <div className={styles.bio}>一生悬命じゃないかしら</div>
            <div className={styles.bio}>猜不透的天气 不知何时能放晴</div>
          </div>
        </section>
      </figure>
    </GlobalContextProvider>
  );
};

export default Index;
