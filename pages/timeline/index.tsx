import React from 'react';
import { UserLayout } from '@/layout/UserLayout';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Feed } from '@/types/Feed';
import { DateTimeFormat } from '@/utils/lib';
import classNames from 'classnames';
import { LayoutFC } from '@/types/GlobalContext';
import styles from './index.module.scss';

type TimelineProps = {
  feeds: Feed[];
};

const Timeline: LayoutFC<TimelineProps> = ({ feeds = [] }) => {
  return (
    <div className={styles.wrap}>
      {feeds.map((feed) => (
        <div key={feed.id} className={styles.container}>
          <div className={styles.author}>
            <div className={styles.avatar}>
              <img src={feed.createBy.avatar} alt="用户头像" />
            </div>
            <div>
              <div className={classNames('text-lg', styles.nickname)}>{feed.createBy.nickname}</div>
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
  );
};

Timeline.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request(`/feed`, { ctx });
  const { data, pathViewCount } = await res.json();
  return {
    props: { feeds: data || [], pathViewCount },
  };
};

export default Timeline;
