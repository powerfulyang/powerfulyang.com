import React, { FC } from 'react';
import { UserLayout } from '@/layout/UserLayout';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Feed } from '@/types/Feed';
import styles from './index.module.scss';

type TimelineProps = {
  feeds: Feed[];
};

type LayoutFC = {
  getLayout: (page: any) => any;
};

const Timeline: FC<TimelineProps> & LayoutFC = ({ feeds = [] }) => {
  return (
    <div className={styles.wrap}>
      {feeds.map((feed) => (
        <div key={feed.id} className={styles.container}>
          <div className={styles.author}>
            <span>{feed.createBy.nickname}</span>
            <div className={styles.avatar}>
              <img src={feed.createBy.avatar} alt="用户头像" />
            </div>
          </div>
          <div className={styles.content}>{feed.content}</div>
        </div>
      ))}
      <div className={styles.container}>
        <textarea className="border border-solid border-black px-2 py-1 cursor-text" />
      </div>
    </div>
  );
};

Timeline.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request(`/feed`, { ctx });
  const { data } = await res.json();
  return {
    props: { feeds: data },
  };
};

export default Timeline;
