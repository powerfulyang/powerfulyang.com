import type { Feed } from '@/__generated__/api';
import {
  castAssetsToImagePreviewItem,
  ImagePreview,
  ImagePreviewAction,
} from '@/components/ImagePreview';
import { LazyImage } from '@/components/LazyImage';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { clientApi } from '@/request/requestTool';
import type { InfiniteQueryResponse } from '@/types/InfiniteQuery';
import { formatDateTime } from '@/utils/format';
import type { Undefinable } from '@powerfulyang/utils';
import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { atom, useAtom } from 'jotai';
import { memo, useEffect } from 'react';
import { MarkdownContainer } from '@/components/MarkdownContainer';
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

export const TimeLineItem = memo<{ feed: Feed }>(({ feed }) => {
  const [, setEditTimeLineItem] = useEditTimeLineItem();
  const { user } = useUser();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['deleteFeed'],
    mutationFn: (id: number) => {
      return clientApi.deleteFeedById(id);
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
          <div className={classNames('text-sm', styles.nickname)}>{feed.createBy.nickname}</div>
          <div className="cursor-text text-xs text-gray-600">{formatDateTime(feed.createdAt)}</div>
        </div>
        {user?.id === feed.createBy.id && (
          <div className="my-auto ml-auto flex">
            <Button
              variant="ghost"
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
              variant="ghost"
              color="error"
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
      <MarkdownContainer source={feed.content} className={styles.content} />
      {!!feed.assets?.length && (
        <div className={classNames(styles.assets)}>
          <ImagePreview images={castAssetsToImagePreviewItem(feed.assets)}>
            {feed.assets?.map((asset, index) => (
              <ImagePreviewAction previewIndex={index} key={asset.id}>
                <LazyAssetImage
                  thumbnail="thumbnail"
                  containerClassName="rounded pointer"
                  className={styles.img}
                  asset={asset}
                />
              </ImagePreviewAction>
            ))}
          </ImagePreview>
        </div>
      )}
    </div>
  );
});

TimeLineItem.displayName = 'TimeLineItem';
