import React, { Fragment, useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import { useInfiniteQuery } from 'react-query';
import { flatten } from 'ramda';
import { InView } from 'react-intersection-observer';
import { UserLayout } from '@/layout/UserLayout';
import { requestAtClient } from '@/utils/client';
import type { Feed } from '@/type/Feed';
import type { LayoutFC } from '@/type/GlobalContext';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import type { InfiniteQueryResponse } from '@/type/InfiniteQuery';
import { requestAtServer } from '@/utils/server';
import { TimeLineItem } from '@/components/Timeline/TimeLineItem';
import { TimeLineForm } from '@/components/Timeline/TimeLineForm';
import { LazyImage } from '@/components/LazyImage';
import { isEmpty, lastItem } from '@powerfulyang/utils';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import bg from '@/assets/timeline-banner.webp';
import { DateTimeFormat } from '@/utils/lib';
import styles from './index.module.scss';

type TimelineProps = {
  feeds: Feed[];
  nextCursor: number;
  prevCursor: number;
};

const Timeline: LayoutFC<TimelineProps> = ({ feeds, nextCursor, prevCursor }) => {
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
  const { user } = useUser();
  const bannerUser = useMemo(() => {
    return user || feeds[0]?.createBy || {};
  }, [user, feeds]);

  const resources = useMemo(() => {
    const res = flatten(data?.pages.map((x) => x.resources) || []);
    return (
      <div className={styles.feeds}>
        {res?.map((feed) => (
          <Fragment key={feed.id}>
            <TimeLineItem feed={feed} />
            {feed.id === lastItem(res)?.id &&
              (hasPreviousPage ? (
                <InView
                  triggerOnce
                  rootMargin="500px"
                  onChange={(inView) => {
                    inView && fetchPreviousPage();
                  }}
                >
                  {({ ref }) => {
                    return (
                      <div className={styles.footer} ref={ref}>
                        Loading...
                      </div>
                    );
                  }}
                </InView>
              ) : (
                <div className={styles.footer}>已经到达世界的尽头...</div>
              ))}
          </Fragment>
        ))}
        {isEmpty(res) && <div className={styles.footer}>这里只有一片虚无...</div>}
      </div>
    );
  }, [data?.pages, fetchPreviousPage, hasPreviousPage]);

  return (
    <div className={styles.wrap}>
      <div className={styles.timelineShow}>
        <div className={styles.banner}>
          {bannerUser.timelineBackground ? (
            <LazyAssetImage
              asset={bannerUser.timelineBackground}
              containerClassName={styles.bannerBg}
              alt="banner"
              thumbnail={false}
            />
          ) : (
            <div className={styles.bannerBg}>
              <Image objectFit="cover" layout="fill" placeholder="blur" src={bg} />
            </div>
          )}
          <div className={styles.authorInfo}>
            <LazyImage
              draggable={false}
              src={bannerUser.avatar}
              containerClassName={styles.authorAvatar}
              alt="avatar"
            />
            <div className={styles.authorNickname}>{bannerUser.nickname}</div>
            <div className={styles.authorBio}>
              <span>{bannerUser.bio || '这个人没有留下什么...'}</span>
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
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await requestAtServer('/public/feed', {
    ctx,
    query: {
      size: 10,
    },
  });
  const { data, pathViewCount } = await res.json();
  return {
    props: {
      currentUrl: ctx.req.url,
      feeds: data.resources.map((x: Feed) => {
        return {
          ...x,
          createAt: DateTimeFormat(x.createAt),
        };
      }),
      nextCursor: data.nextCursor,
      prevCursor: data.prevCursor,
      pathViewCount,
      title: '说说',
    },
  };
};

export default Timeline;
