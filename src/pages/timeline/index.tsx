import React, { Fragment, useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import classNames from 'classnames';
import { useInfiniteQuery } from 'react-query';
import { flatten } from 'ramda';
import { InView } from 'react-intersection-observer';
import { UserLayout } from '@/layout/UserLayout';
import { requestAtClient } from '@/utils/client';
import type { Feed } from '@/type/Feed';
import type { LayoutFC } from '@/type/GlobalContext';
import type { User } from '@/type/User';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import styles from './index.module.scss';
import { getCurrentUser } from '@/service/getCurrentUser';
import type { InfiniteQueryResponse } from '@/type/InfiniteQuery';
import { requestAtServer } from '@/utils/server';
import { TimeLineItem } from '@/components/Timeline/TimeLineItem';
import { TimeLineForm } from '@/components/Timeline/TimeLineForm';

type TimelineProps = {
  feeds: Feed[];
  user?: User;
  nextCursor: number;
  prevCursor: number;
};

const Timeline: LayoutFC<TimelineProps> = ({ feeds, user, nextCursor, prevCursor }) => {
  const { data, fetchNextPage, fetchPreviousPage, hasPreviousPage } = useInfiniteQuery(
    ['feeds', feeds, nextCursor, prevCursor],
    async ({ pageParam }) => {
      const res = await requestAtClient<InfiniteQueryResponse<Feed>>('/public/feed', {
        query: pageParam,
      });
      return res.data;
    },
    {
      enabled: false,
      getNextPageParam(lastPage) {
        return { nextCursor: lastPage.nextCursor };
      },
      getPreviousPageParam(firstPage) {
        const { prevCursor: cursor } = firstPage;
        if (cursor) {
          return { prevCursor: cursor };
        }
        return cursor;
      },
      select(page) {
        return {
          pages: [...page.pages].reverse(),
          pageParams: [...page.pageParams].reverse(),
        };
      },
      initialData: {
        pages: [
          {
            resources: feeds,
            nextCursor,
            prevCursor,
          },
        ],
        pageParams: [{ nextCursor, prevCursor }],
      },
    },
  );

  const bannerUser = useMemo(() => {
    return user || feeds[0]?.createBy || {};
  }, [user, feeds]);

  const resources = useMemo(() => {
    const res = flatten(data?.pages.map((x) => x.resources) || []);
    return (
      <div className={styles.feeds}>
        {res?.map((feed, index) => (
          <Fragment key={feed.id}>
            <TimeLineItem feed={feed} />
            {index === res.length - 1 &&
              (hasPreviousPage ? (
                <InView triggerOnce>
                  {({ ref, inView }) => {
                    inView && fetchPreviousPage();
                    return (
                      <div className={styles.footer} ref={ref}>
                        Loading...
                      </div>
                    );
                  }}
                </InView>
              ) : (
                <div className={styles.footer}>No More!</div>
              ))}
          </Fragment>
        ))}
        {res.length === 0 && <div className={styles.footer}>No Content!</div>}
      </div>
    );
  }, [data?.pages, fetchPreviousPage, hasPreviousPage]);

  return (
    <div className={styles.wrap}>
      <div className={styles.timelineShow}>
        <div className={styles.banner}>
          <LazyAssetImage
            asset={bannerUser.timelineBackground}
            containerClassName={styles.bannerBg}
            className={classNames(styles.bannerImage)}
          />
          <div className={styles.authorInfo}>
            <img draggable={false} src={bannerUser.avatar} className={styles.authorAvatar} alt="" />
            <div className={styles.authorNickname}>{bannerUser.nickname}</div>
            <div className={styles.authorBio}>
              <span>{bannerUser.bio}</span>
            </div>
          </div>
        </div>
        <TimeLineForm onSubmitSuccess={fetchNextPage} />
        {resources}
      </div>
    </div>
  );
};

Timeline.getLayout = (page) => {
  const { pathViewCount, user } = page.props;
  return (
    <UserLayout user={user} pathViewCount={pathViewCount}>
      {page}
    </UserLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await requestAtServer('/public/feed', {
    ctx,
    query: {
      size: 10,
    },
  });
  const user = await getCurrentUser(ctx);
  const { data, pathViewCount } = await res.json();
  return {
    props: {
      feeds: data.resources,
      nextCursor: data.nextCursor,
      prevCursor: data.prevCursor,
      pathViewCount,
      user,
      title: '说说',
    },
  };
};

export default Timeline;
