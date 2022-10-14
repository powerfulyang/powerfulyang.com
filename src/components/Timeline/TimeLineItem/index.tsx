import classNames from 'classnames';
import React, { memo, Suspense } from 'react';
import { LazyImage } from '@/components/LazyImage';
import { castAssetsToImagePreviewItem, ImagePreview } from '@/components/ImagePreview';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import type { Feed } from '@/type/Feed';
import { DateTimeFormat } from '@/utils/lib';
import { LazyMarkdownContainer } from '@/components/MarkdownContainer/lazy';
import { Skeleton } from '@/components/Skeleton';
import styles from './index.module.scss';

export const TimeLineItem = memo<{ feed: Feed }>(({ feed }) => {
  return (
    <div key={feed.id} className={styles.container}>
      <div className={styles.author}>
        <div className={styles.avatar}>
          <LazyImage
            lazy={false}
            draggable={false}
            className="select-none rounded-lg"
            src={feed.createBy.avatar}
            alt="用户头像"
          />
        </div>
        <div className="flex flex-col justify-evenly">
          <div className={classNames('text-lg', styles.nickname)}>{feed.createBy.nickname}</div>
          <div className="cursor-text text-xs text-gray-600">{DateTimeFormat(feed.createAt)}</div>
        </div>
      </div>
      <Suspense fallback={<Skeleton rows={2} />}>
        <LazyMarkdownContainer source={feed.content} className={styles.content} />
      </Suspense>
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
