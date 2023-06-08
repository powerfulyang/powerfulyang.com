import type { Feed } from '@/__generated__/api';
import bg from '@/assets/timeline-banner.webp';
import { origin } from '@/components/Head';
import { LazyImage } from '@/components/LazyImage';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { TimeLineForm } from '@/components/Timeline/TimelineForm';
import { getTimelineItemElement, TimeLineItem } from '@/components/Timeline/TimelineItem';
import { useUser } from '@/hooks/useUser';
import { UserLayout } from '@/layout/UserLayout';
import { clientApi, serverApi } from '@/request/requestTool';
import type { LayoutFC } from '@/types/GlobalContext';
import type { InfiniteQueryResponse } from '@/types/InfiniteQuery';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
import { firstItem, isEmpty, lastItem } from '@powerfulyang/utils';
import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { flatten } from 'lodash-es';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import React, { Fragment, useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import styles from './index.module.scss';

type TimelineProps = {
  feeds: Feed[];
  nextCursor: number;
  prevCursor: number;
};

export const Timeline: LayoutFC<TimelineProps> = ({ feeds, nextCursor, prevCursor }) => {
  const { data, fetchNextPage, fetchPreviousPage, hasPreviousPage } = useInfiniteQuery(
    ['feeds', feeds, nextCursor, prevCursor],
    ({ pageParam }) => {
      return clientApi
        .infiniteQueryPublicTimeline({
          ...pageParam,
          take: 10,
        })
        .then((x) => x.data);
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
        pageParams: [{ nextCursor: lastItem(feeds)?.id, prevCursor: firstItem(feeds)?.id }],
      },
    },
  );
  const { user } = useUser();
  const bannerUser = user || feeds[0]?.createBy || {};

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

  const queryClient = useQueryClient();

  return (
    <div className={styles.wrap}>
      <div className={styles.timelineShow}>
        <div className={styles.banner}>
          {bannerUser.timelineBackground ? (
            <LazyAssetImage
              asset={bannerUser.timelineBackground}
              containerClassName={styles.bannerBg}
              thumbnail="poster"
              alt="banner"
            />
          ) : (
            <div className={styles.bannerBg}>
              <Image
                className="object-cover"
                fill
                placeholder="blur"
                src={bg}
                alt="banner-background"
              />
            </div>
          )}
          <div className={styles.authorInfo}>
            <LazyImage
              aspectRatio="1 / 1"
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
        <TimeLineForm
          onSubmitSuccess={(type, feed) => {
            if (type === 'create') {
              return fetchNextPage();
            }
            if (type === 'modify') {
              queryClient.setQueryData<InfiniteData<InfiniteQueryResponse<Feed>>>(
                ['feeds', feeds, nextCursor, prevCursor],
                (previous) => {
                  return {
                    pages:
                      previous?.pages.map((page) => {
                        return {
                          ...page,
                          resources: page.resources.map((f) => {
                            if (f.id === feed.id) {
                              return feed;
                            }
                            return f;
                          }),
                        };
                      }) || [],
                    pageParams: previous?.pageParams || [],
                  };
                },
              );
              requestAnimationFrame(() => {
                const targetElement = getTimelineItemElement(feed.id);
                targetElement?.scrollIntoView({ behavior: 'smooth' });
              });
            }
            return null;
          }}
        />
        {resources}
      </div>
    </div>
  );
};

Timeline.getLayout = (page) => {
  const { pathViewCount } = page.props.layout;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await serverApi.infiniteQueryPublicTimeline(
    {
      take: 10,
    },
    {
      headers: extractRequestHeaders(ctx.req.headers),
    },
  );
  const pathViewCount = res.headers.get('x-path-view-count');
  const { data } = res;
  return {
    props: {
      feeds: data.resources,
      nextCursor: data.nextCursor,
      prevCursor: data.prevCursor,
      meta: {
        title: '说说',
        description: '关于我日常的胡言乱语',
      },
      layout: {
        pathViewCount,
      },
      link: {
        canonical: `${origin}/timeline`,
      },
    },
  };
};

export default Timeline;
