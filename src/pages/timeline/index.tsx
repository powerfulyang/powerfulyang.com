import type { Feed } from '@/__generated__/api';
import { origin } from '@/components/Head';
import { LazyImage } from '@/components/LazyImage';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { Skeleton } from '@/components/Skeleton';
import { TimeLineForm } from '@/components/Timeline/TimelineForm';
import { TimeLineItem } from '@/components/Timeline/TimelineItem';
import { useUser } from '@/hooks/useUser';
import { UserLayout } from '@/layout/UserLayout';
import { clientApi, serverApi } from '@/request/requestTool';
import type { LayoutFC } from '@/types/GlobalContext';
import type { InfiniteQueryResponse } from '@/types/InfiniteQuery';
import { checkAuthInfo, extractRequestHeaders } from '@/utils/extractRequestHeaders';
import { firstItem, isEmpty, lastItem } from '@powerfulyang/utils';
import type { InfiniteData } from '@tanstack/react-query';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { kv } from '@vercel/kv';
import { flatten } from 'lodash-es';
import type { GetServerSideProps } from 'next';
import React, { useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import styles from './index.module.scss';

type TimelineProps = {
  feeds: Feed[];
  nextCursor: number;
  prevCursor: number;
};

export const Timeline: LayoutFC<TimelineProps> = ({ feeds, nextCursor, prevCursor }) => {
  const { data, isError, fetchNextPage, fetchPreviousPage, hasPreviousPage, isFetching } =
    useInfiniteQuery(
      ['feeds', feeds, nextCursor, prevCursor],
      async ({ pageParam }) => {
        const x = await clientApi.infiniteQueryPublicTimeline({
          ...pageParam,
          take: 10,
        });
        return x.data;
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
        retry: false,
      },
    );
  const { user } = useUser();
  const bannerUser = user || feeds[0]?.createBy || {};

  const resources = useMemo(() => {
    const res = flatten(data?.pages.map((x) => x.resources) || []);
    return (
      <div className={styles.feeds}>
        {res?.map((feed) => <TimeLineItem feed={feed} key={feed.id} />)}
        {!isError &&
          !isFetching &&
          !isEmpty(res) &&
          (hasPreviousPage ? (
            <InView
              triggerOnce
              rootMargin="10px"
              onChange={(inView) => {
                inView && fetchPreviousPage();
              }}
              as="div"
            />
          ) : (
            <div className={styles.footer}>已经到达世界的尽头...</div>
          ))}
        {isEmpty(res) && !isFetching && !isError && (
          <div className={styles.footer}>这里只有一片虚无...</div>
        )}
        {isFetching && <Skeleton rows={6} className="px-4 pb-4 pt-4" />}
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
  const requestHeaders = extractRequestHeaders(ctx.req.headers);
  const hasAuthInfo = checkAuthInfo(requestHeaders);

  if (!hasAuthInfo) {
    try {
      const _ = await kv.get<any>(`props:timeline:index`);
      if (_) {
        return _;
      }
    } catch (e) {
      // ignore
    }
  }

  const res = await serverApi.infiniteQueryPublicTimeline(
    {
      take: 10,
    },
    {
      headers: requestHeaders,
    },
  );
  const pathViewCount = res.headers.get('x-path-view-count');
  const { data } = res;
  const props = {
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
  if (!hasAuthInfo) {
    try {
      // await kv.set(`props:timeline:index`, props);
    } catch (e) {
      // ignore
    }
  }
  return props;
};

export default Timeline;

export const runtime = 'experimental-edge';
