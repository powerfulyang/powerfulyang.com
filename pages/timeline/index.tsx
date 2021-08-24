import React, { useEffect, useState } from 'react';
import { UserLayout } from '@/layout/UserLayout';
import { GetServerSidePropsContext } from 'next';
import { clientRequest, request } from '@/utils/request';
import { Feed } from '@/types/Feed';
import { CosUtils, DateTimeFormat } from '@/utils/lib';
import classNames from 'classnames';
import { LayoutFC } from '@/types/GlobalContext';
import { User } from '@/types/User';
import { constants } from 'http2';
import styles from './index.module.scss';

type TimelineProps = {
  sourceFeeds: Feed[];
  user?: User;
};

const Timeline: LayoutFC<TimelineProps> = ({ sourceFeeds, user }) => {
  const [content, setContent] = useState('');
  const [feeds, setFeeds] = useState(sourceFeeds);
  const [userBg, setUserBg] = useState('/transparent.png');
  const submitTimeline = async () => {
    const res = await clientRequest('/feed', {
      body: { content },
      method: 'POST',
    });
    if (res.status === 'ok') {
      const { data } = await clientRequest('/public/feed');
      setFeeds(data);
      setContent('');
    }
  };
  useEffect(() => {
    if (user?.timelineBackground?.objectUrl) {
      setUserBg(`url(${CosUtils.getCosObjectUrl(user?.timelineBackground?.objectUrl)})`);
    } else {
      setUserBg(
        `url(${CosUtils.getCosObjectUrl(sourceFeeds[0]?.createBy?.timelineBackground?.objectUrl)})`,
      );
    }
  }, [user?.timelineBackground?.objectUrl, sourceFeeds]);
  return (
    <div className={styles.wrap}>
      <div className={styles.timeline_show}>
        <div className={styles.banner}>
          <div
            style={{
              backgroundImage: userBg,
            }}
            className={styles.banner_bg}
          />
          <div className={styles.author_info}>
            <img src={user?.avatar} className={styles.author_avatar} alt="" />
            <div className={styles.author_nickname}>{user?.nickname}</div>
            <div className={styles.author_bio}>
              <span>{user?.bio}</span>
            </div>
          </div>
        </div>
        {user && (
          <div className={styles.timeline_input}>
            <div className={styles.timeline_textarea}>
              <textarea
                name="timeline_input"
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                value={content}
              />
            </div>
            <div className="text-right mr-4 mt-2 mb-4">
              <button
                onClick={submitTimeline}
                type="button"
                className={classNames(styles.timeline_submit, 'pointer')}
              >
                发送
              </button>
            </div>
          </div>
        )}
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
                    <div key={asset.id}>
                      <img src={asset.objectUrl} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {!feeds.length && <div className="text-lg text-pink-400 text-center">No Content!</div>}
        </div>
      </div>
    </div>
  );
};

Timeline.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request(`/public/feed`, { ctx });
  const { data, pathViewCount } = await res.json();
  const tmp = await request('/user/current', { ctx });
  let user;
  if (tmp.status === constants.HTTP_STATUS_OK) {
    const { data: tmpUser } = await tmp.json();
    user = tmpUser;
  } else {
    user = null;
  }
  return {
    props: { sourceFeeds: data || [], pathViewCount, user },
  };
};

export default Timeline;
