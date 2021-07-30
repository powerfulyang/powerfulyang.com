import React, { FC } from 'react';
import { UserLayout } from '@/layout/UserLayout';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Feed } from '@/types/Feed';
import { DateTimeFormat } from '@/utils/lib';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import classNames from 'classnames';
import styles from './index.module.scss';

type TimelineProps = {
  feeds: Feed[];
};

type LayoutFC = {
  getLayout: (page: any) => any;
};

const Timeline: FC<TimelineProps> & LayoutFC = ({ feeds = [] }) => {
  return (
    <GlobalContextProvider>
      <div className={styles.wrap}>
        {feeds.map((feed) => (
          <div key={feed.id} className={styles.container}>
            <div className={styles.author}>
              <div className={styles.avatar}>
                <img src={feed.createBy.avatar} alt="用户头像" />
              </div>
              <div>
                <div className={classNames('text-lg', styles.nickname)}>
                  {feed.createBy.nickname}
                </div>
                <div className="text-gray-400 text-xs">{DateTimeFormat(feed.createAt)}</div>
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.text}>{feed.content}</div>
              <div className={styles.assets}>
                {feed.assets?.map((asset) => (
                  <img src={asset.objectUrl} key={asset.id} alt="" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlobalContextProvider>
  );
};

Timeline.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request(`/feed`, { ctx });
  const { data } = await res.json();
  return {
    props: { feeds: data || [] },
  };
};

export default Timeline;
