import React, { useEffect, useState } from 'react';
import { UserLayout } from '@/layout/UserLayout';
import { GetServerSidePropsContext } from 'next';
import { clientRequest, request } from '@/utils/request';
import { Feed } from '@/types/Feed';
import { CosUtils, DateTimeFormat } from '@/utils/lib';
import classNames from 'classnames';
import { LayoutFC } from '@/types/GlobalContext';
import { constants } from 'http2';
import { login } from '@/components/NavBar';
import { User } from '@/types/User';
import { useRouter } from 'next/router';
import styles from './index.module.scss';

type TimelineProps = {
  feeds: Feed[];
  UNAUTHORIZED: boolean;
  user: User;
};

const Timeline: LayoutFC<TimelineProps> = ({ feeds = [], UNAUTHORIZED, user }) => {
  const [content, setContent] = useState('');
  const router = useRouter();
  const [userBg, setUserBg] = useState('');
  const submitTimeline = async () => {
    const res = await clientRequest('/feed', {
      body: { content },
      method: 'POST',
    });
    if (res.status === 'ok') {
      await router.push('/timeline');
    }
  };
  useEffect(() => {
    setUserBg(`url(${CosUtils.getCosObjectUrl(user.timelineBackground?.objectUrl)})`);
  }, [user.timelineBackground?.objectUrl]);
  return (
    <div className={styles.wrap}>
      {UNAUTHORIZED && (
        <div className="m-auto text-pink-400 text-center cursor-self-pointer" onClick={login}>
          This page is need Login!
        </div>
      )}
      {user && (
        <div className={styles.timeline_show}>
          <div className={styles.banner}>
            <div
              style={{
                backgroundImage: userBg,
              }}
              className={styles.banner_bg}
            />
            <div className={styles.author_info}>
              <img src={user.avatar} className={styles.author_avatar} alt="" />
              <div className={styles.author_nickname}>{user.nickname}</div>
              <div className={styles.author_bio}>
                <span>{user.bio}</span>
              </div>
            </div>
          </div>
          <div className={styles.feeds}>
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
        </div>
      )}
      <div className={styles.timeline_input}>
        <textarea
          name="timeline_input"
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <button
          onClick={submitTimeline}
          type="button"
          className={classNames(styles.timeline_submit, 'pointer')}
        >
          发送
        </button>
      </div>
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
