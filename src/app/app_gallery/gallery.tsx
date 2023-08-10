'use client';

import { firstItem, lastItem } from '@powerfulyang/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { flatten } from 'lodash-es';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import type { Asset } from '@/__generated__/api';
import { castAssetsToImagePreviewItem, ImagePreview } from '@/components/ImagePreview';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import Masonry from '@/components/Masonry';
import styles from '@/pages/gallery/index.module.scss';
import { clientApi } from '@/request/requestTool';

type GalleryProps = {
  assets: Asset[];
  nextCursor?: number;
  prevCursor?: number;
};

export const Gallery: FC<GalleryProps> = ({ assets, nextCursor, prevCursor }) => {
  const { data, fetchPreviousPage, hasPreviousPage } = useInfiniteQuery(
    ['assets', assets, nextCursor, prevCursor],
    ({ pageParam }) => {
      return clientApi
        .infiniteQueryPublicAsset({
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
            resources: assets,
            nextCursor,
            prevCursor,
          },
        ],
        pageParams: [{ nextCursor: lastItem(assets)?.id, prevCursor: firstItem(assets)?.id }],
      },
    },
  );

  const resources = useMemo(
    () => flatten(data?.pages.map((x) => x.resources) || []),
    [data?.pages],
  );

  const images = useMemo(() => {
    return castAssetsToImagePreviewItem(resources);
  }, [resources]);

  return (
    <main className={styles.gallery}>
      <ImagePreview images={images}>
        <Masonry
          onLoadMore={() => {
            hasPreviousPage && fetchPreviousPage();
          }}
        >
          {resources.map((asset, index) => (
            <LazyAssetImage
              key={asset.id}
              id={`${asset.id}`}
              previewIndex={index}
              title={`${asset.id}`}
              asset={asset}
              thumbnail="thumbnail"
              containerClassName="contain-strict pointer rounded-lg"
              className={styles.image}
              keepAspectRatio
              draggable={false}
            />
          ))}
        </Masonry>
      </ImagePreview>
    </main>
  );
};
