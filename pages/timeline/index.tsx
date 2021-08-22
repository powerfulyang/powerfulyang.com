import React from 'react';
import { UserLayout } from '@/layout/UserLayout';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Feed } from '@/types/Feed';
import { CosUtils, DateTimeFormat } from '@/utils/lib';
import classNames from 'classnames';
import { LayoutFC } from '@/types/GlobalContext';
import { constants } from 'http2';
import { login } from '@/components/NavBar';
import { User } from '@/types/User';
import styles from './index.module.scss';

type TimelineProps = {
  feeds: Feed[];
  UNAUTHORIZED: boolean;
  user: User;
};

const Timeline: LayoutFC<TimelineProps> = ({ feeds = [], UNAUTHORIZED, user }) => {
  return (
    <div className={styles.wrap}>
      {UNAUTHORIZED && (
        <div className="m-auto text-pink-400 text-center cursor-self-pointer" onClick={login}>
          This page is need Login!
        </div>
      )}
      {user && (
        <div className={styles.banner}>
          <div
            style={{
              backgroundImage: `url(${CosUtils.getCosObjectThumbnailUrl(
                user.timelineBackground?.objectUrl,
              )})`,
            }}
            className={styles.banner_bg}
          />
          <div className={styles.author_info}>
            <img src={user.avatar} className={styles.author_avatar} alt="" />
            <div className={styles.author_nickname}>{user.nickname}</div>
            <div className={styles.author_bio}>{user.bio}</div>
          </div>
        </div>
      )}
      {!UNAUTHORIZED &&
        feeds.map((feed) => (
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
  );
};

Timeline.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request(`/feed`, { ctx });
  const tmp = await request('/user/current', {
    ctx,
  });
  const { data, pathViewCount } = await res.json();
  if (res.status === constants.HTTP_STATUS_UNAUTHORIZED) {
    return {
      props: { UNAUTHORIZED: true },
    };
  }
  const { data: user } = await tmp.json();
  return {
    props: { feeds: data || [], pathViewCount, user },
  };
};

export default Timeline;
