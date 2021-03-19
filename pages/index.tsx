import React, { FC } from 'react';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Button } from '@/components/Button';
import { Icon } from '@powerfulyang/components';
import styles from './index.module.scss';

const Index: FC = () => {
  return (
    <GlobalContextProvider>
      <Header />
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
    </GlobalContextProvider>
  );
};

export default Index;
