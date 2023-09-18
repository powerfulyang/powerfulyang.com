'use client';

import type { Asset } from '@/__generated__/api';
import {
  castAssetsToImagePreviewItem,
  ImagePreview,
  ImagePreviewAction,
} from '@/components/ImagePreview';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import Masonry from '@/components/Masonry';
import styles from '@/pages/gallery/index.module.scss';
import { clientApi } from '@/request/requestTool';
import { firstItem, lastItem } from '@powerfulyang/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { flatten } from 'lodash-es';
import type { FC } from 'react';
import React from 'react';

type GalleryProps = {
  assets: Asset[];
  nextCursor?: number;
  prevCursor?: number;
};

export const Gallery: FC<GalleryProps> = ({ assets, nextCursor, prevCursor }) => {
  const { isFetching, data, fetchPreviousPage, hasPreviousPage } = useInfiniteQuery(
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

  const resources = flatten(data?.pages.map((x) => x.resources) || []);

  const images = castAssetsToImagePreviewItem(resources);

  const itemRender = (item: Asset, index: number) => (
    <ImagePreviewAction previewIndex={index}>
      <LazyAssetImage
        id={`${item.id}`}
        asset={item}
        thumbnail="thumbnail"
        containerClassName="pointer rounded-lg"
        className={styles.image}
        keepAspectRatio
        draggable={false}
      />
    </ImagePreviewAction>
  );

  return (
    <main className={styles.gallery}>
      <ImagePreview images={images}>
        <Masonry
          onLoadMore={() => {
            hasPreviousPage && fetchPreviousPage();
          }}
          isLoading={isFetching}
          data={resources}
          itemRender={itemRender}
        />
      </ImagePreview>
    </main>
  );
};
