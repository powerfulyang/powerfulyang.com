import type { Feed, User } from '@/__generated__/api';
import { origin } from '@/components/Head';
import { LazyImage } from '@/components/LazyImage';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { TimeLineForm } from '@/components/Timeline/TimelineForm';
import { TimeLineItem } from '@/components/Timeline/TimelineItem';
import { Skeleton } from '@/components/Skeleton';
import { useUser } from '@/hooks/useUser';
import { UserLayout } from '@/layout/UserLayout';
import { clientApi } from '@/request/requestTool';
import type { LayoutFC } from '@/types/GlobalContext';
import type { InfiniteQueryResponse } from '@/types/InfiniteQuery';
import { isEmpty, lastItem } from '@powerfulyang/utils';
import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { flatten } from 'lodash-es';
import React, { Fragment, useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import styles from './index.module.scss';

type TimelineProps = {};

export const Timeline: LayoutFC<TimelineProps> = () => {
  const { data, isError, fetchNextPage, fetchPreviousPage, hasPreviousPage, isFetching } =
    useInfiniteQuery(
      ['feeds'],
      async ({ pageParam }) => {
        const x = await clientApi.infiniteQueryPublicTimeline({
          ...pageParam,
          take: 10,
        });
        return x.data;
      },
      {
        enabled: true,
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
        retry: false,
      },
    );
  const { user } = useUser();
  const bannerUser = user || data?.pages[0]?.resources[0]?.createBy || ({} as User);

  const resources = useMemo(() => {
    const res = flatten(data?.pages.map((x) => x.resources) || []);
    return (
      <div className={styles.feeds}>
        {res?.map((feed) => (
          <Fragment key={feed.id}>
            <TimeLineItem feed={feed} />
            {feed.id === lastItem(res)?.id &&
              (hasPreviousPage && !isError ? (
                <InView
                  triggerOnce
                  rootMargin="10px"
                  onChange={(inView) => {
                    inView && !isFetching && fetchPreviousPage();
                  }}
                  as="div"
                />
              ) : (
                <div className={styles.footer}>已经到达世界的尽头...</div>
              ))}
          </Fragment>
        ))}
        {isError && (
          <div className={styles.footer}>
            <button
              type="button"
              className="pointer text-red-500"
              onClick={() => {
                return fetchPreviousPage();
              }}
            >
              加载失败，点击重试
            </button>
          </div>
        )}
        {isEmpty(res) && !isFetching && !isError && (
          <div className={styles.footer}>这里只有一片虚无...</div>
        )}
        {isFetching && <Skeleton rows={6} className="px-4 pb-4" />}
      </div>
    );
  }, [data?.pages, fetchPreviousPage, hasPreviousPage, isError, isFetching]);

  const queryClient = useQueryClient();

  return (
    <div className={styles.wrap}>
      <div className={styles.timelineShow}>
        <div className={styles.banner}>
          {(bannerUser?.timelineBackground && (
            <LazyAssetImage
              asset={bannerUser.timelineBackground}
              containerClassName={styles.bannerBg}
              thumbnail="poster"
              alt="banner"
            />
          )) || (
            <LazyImage
              draggable={false}
              src="/thumbnail_700_.webp"
              blurSrc="/thumbnail_blur_.webp"
              containerClassName={styles.bannerBg}
              alt="banner"
            />
          )}
          <div className={styles.authorInfo}>
            <LazyImage
              key={bannerUser.avatar}
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
                ['feeds'],
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

export const getStaticProps = () => {
  return {
    props: {
      meta: {
        title: '说说',
        description: '关于我日常的胡言乱语',
      },
      layout: {
        pathViewCount: 0,
      },
      link: {
        canonical: `${origin}/timeline`,
      },
    },
  };
};

export default Timeline;
