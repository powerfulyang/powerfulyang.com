import React, { useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { flatten } from 'ramda';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { requestAtClient } from '@/utils/client';
import type { Asset } from '@/type/Asset';
import type { InfiniteQueryResponse } from '@/type/InfiniteQuery';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { castAssetsToImagePreviewItem, ImagePreview } from '@/components/ImagePreview';
import { requestAtServer } from '@/utils/server';
import Masonry from '@/components/Masonry';
import styles from './index.module.scss';

type GalleryProps = {
  assets: Asset[];
  nextCursor: number;
  prevCursor: number;
};

export const Gallery: LayoutFC<GalleryProps> = ({ assets, nextCursor, prevCursor }) => {
  const { data, fetchPreviousPage, hasPreviousPage } = useInfiniteQuery(
    ['assets', assets, nextCursor, prevCursor],
    async ({ pageParam }) => {
      const res = await requestAtClient<InfiniteQueryResponse<Asset>>('/public/asset', {
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
            resources: assets,
            nextCursor,
            prevCursor,
          },
        ],
        pageParams: [{ nextCursor, prevCursor }],
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

  const toRender = useMemo(() => {
    return resources.map((asset, index) => (
      <LazyAssetImage
        key={asset.id}
        id={`${asset.id}`}
        previewIndex={index}
        title={`${asset.id}`}
        asset={asset}
        initialInView={index < 20}
        containerClassName="rounded-lg shadow-lg contain-strict pointer"
        keepAspectRatio
        triggerOnce={false}
        draggable={false}
      />
    ));
  }, [resources]);

  return (
    <main className={styles.gallery}>
      <ImagePreview images={images}>
        <Masonry
          onLoadMore={() => {
            hasPreviousPage && fetchPreviousPage();
          }}
        >
          {toRender}
        </Masonry>
      </ImagePreview>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await requestAtServer('/public/asset', {
    ctx,
    query: {
      take: 20,
    },
  });
  const { data, pathViewCount } = await res.json();
  return {
    props: {
      assets: data.resources,
      nextCursor: data.nextCursor,
      prevCursor: data.prevCursor,
      pathViewCount,
      title: '图片墙',
    },
  };
};

Gallery.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export default Gallery;
