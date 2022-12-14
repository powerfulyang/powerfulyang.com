import classNames from 'classnames';
import React, { memo, Suspense, useEffect, useMemo } from 'react';
import { LazyImage } from '@/components/LazyImage';
import { castAssetsToImagePreviewItem, ImagePreview } from '@/components/ImagePreview';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import type { Feed } from '@/type/Feed';
import { DateTimeFormat } from '@/utils/lib';
import { Skeleton } from '@/components/Skeleton';
import { atom, useAtom } from 'jotai';
import type { Undefinable } from '@powerfulyang/utils';
import { Button } from '@powerfulyang/components';
import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestAtClient } from '@/utils/client';
import type { InfiniteQueryResponse } from '@/type/InfiniteQuery';
import { useUser } from '@/hooks/useUser';
import { TimelineItemContext } from '@/components/Timeline/TimelineItem/TimelineItemContext';
import { LazyMarkdownContainer } from '@/components/MarkdownContainer/lazy';
import styles from './index.module.scss';

export const EditTimeLineItemAtom = atom<Undefinable<Feed>>(undefined);

export const useEditTimeLineItem = () => {
  const [editTimeLineItem, setEditTimeLineItem] = useAtom(EditTimeLineItemAtom);

  useEffect(() => {
    return () => {
      setEditTimeLineItem(undefined);
    };
  }, [setEditTimeLineItem]);

  return [editTimeLineItem, setEditTimeLineItem] as const;
};

export const getTimelineItemId = (id: number) => `timeline-item-${id}`;
export const getTimelineItemElement = (id: number) => {
  return document.getElementById(getTimelineItemId(id));
};

export const TimeLineItem = memo<{ feed: Feed }>(({ feed }) => {
  const [, setEditTimeLineItem] = useEditTimeLineItem();
  const { user } = useUser();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['deleteFeed'],
    mutationFn: (id: number) => {
      return requestAtClient(`/feed/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess() {
      const [queries] = queryClient.getQueriesData(['feeds']);
      const queryKey = queries[0];
      queryClient.setQueryData<InfiniteData<InfiniteQueryResponse<Feed>>>(queryKey, (data) => {
        return {
          pages:
            data?.pages.map((page) => {
              return {
                ...page,
                resources: page.resources.filter((f) => f.id !== feed.id),
              };
            }) || [],
          pageParams: data?.pageParams || [],
        };
      });
    },
  });

  const contextValue = useMemo(() => {
    return { id_prefix: getTimelineItemId(feed.id) };
  }, [feed.id]);

  const content = useMemo(() => {
    return (
      <Suspense fallback={<Skeleton rows={2} />}>
        <article>
          <h2 id={getTimelineItemId(feed.id)}>{getTimelineItemId(feed.id)}</h2>
          <TimelineItemContext.Provider value={contextValue}>
            <LazyMarkdownContainer source={feed.content} className={styles.content} />
          </TimelineItemContext.Provider>
        </article>
      </Suspense>
    );
  }, [contextValue, feed.content, feed.id]);

  return (
    <div key={feed.id} className={styles.container}>
      <div className={styles.author}>
        <div className={styles.avatar}>
          <LazyImage
            lazy={false}
            draggable={false}
            className="aspect-square select-none rounded-lg"
            src={feed.createBy.avatar}
            alt="用户头像"
          />
        </div>
        <div className="flex flex-col justify-evenly">
          <div className={classNames('text-lg', styles.nickname)}>{feed.createBy.nickname}</div>
          <div className="cursor-text text-xs text-gray-600">{DateTimeFormat(feed.createAt)}</div>
        </div>
        {user?.id === feed.createBy.id && (
          <div className="ml-auto flex flex-col justify-evenly">
            <Button
              onClick={() => {
                setEditTimeLineItem(feed);
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }}
              className="pointer text-xs text-purple-500"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                // eslint-disable-next-line no-alert
                window.confirm('确定删除吗？') && mutation.mutate(feed.id);
              }}
              className="pointer text-xs text-red-500"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      {content}
      {!!feed.assets?.length && (
        <div className={classNames(styles.assets)}>
          <ImagePreview parentControl images={castAssetsToImagePreviewItem(feed.assets)}>
            {feed.assets?.map((asset) => (
              <LazyAssetImage
                containerClassName="rounded pointer"
                key={asset.id}
                className={styles.img}
                asset={asset}
              />
            ))}
          </ImagePreview>
        </div>
      )}
    </div>
  );
});

TimeLineItem.displayName = 'TimeLineItem';
