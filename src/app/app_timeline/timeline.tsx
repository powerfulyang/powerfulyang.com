'use client';

import { firstItem, isEmpty, lastItem } from '@powerfulyang/utils';
import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { flatten } from 'lodash-es';
import Image from 'next/image';
import type { FC } from 'react';
import React, { Fragment, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Feed } from '@/__generated__/api';
import bg from '@/assets/timeline-banner.webp';
import { LazyImage } from '@/components/LazyImage';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { TimeLineForm } from '@/components/Timeline/TimelineForm';
import { getTimelineItemElement, TimeLineItem } from '@/components/Timeline/TimelineItem';
import { useUser } from '@/hooks/useUser';
import styles from '@/pages/timeline/index.module.scss';
import { clientApi } from '@/request/requestTool';
import type { InfiniteQueryResponse } from '@/types/InfiniteQuery';

type TimelineProps = {
  feeds: Feed[];
  nextCursor?: number;
  prevCursor?: number;
};

export const Timeline: FC<TimelineProps> = ({ feeds, nextCursor, prevCursor }) => {
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

  const { ref } = useInView({
    triggerOnce: true,
    onChange(inView) {
      inView && fetchPreviousPage();
    },
  });

  const resources = useMemo(() => {
    const res = flatten(data?.pages.map((x) => x.resources) || []);
    return (
      <div className={styles.feeds}>
        {res?.map((feed) => (
          <Fragment key={feed.id}>
            <TimeLineItem feed={feed} />
            {feed.id === lastItem(res)?.id &&
              (hasPreviousPage ? (
                <div
                  className={classNames(styles.footer, 'flex items-center justify-center')}
                  ref={ref}
                >
                  <div className={styles.loading}>Loading</div>
                </div>
              ) : (
                <div className={styles.footer}>已经到达世界的尽头...</div>
              ))}
          </Fragment>
        ))}
        {isEmpty(res) && <div className={styles.footer}>这里只有一片虚无...</div>}
      </div>
    );
  }, [data?.pages, hasPreviousPage, ref]);

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
