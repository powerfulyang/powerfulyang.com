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
import { useFixMinHeight } from '@/hooks/useFixMinHeight';
import { firstItem, lastItem } from '@powerfulyang/utils';
import { origin } from '@/components/Head';
import styles from './index.module.scss';

type GalleryProps = {
  assets: Asset[];
  nextCursor: number;
  prevCursor: number;
};

export const Gallery: LayoutFC<GalleryProps> = ({ assets, nextCursor, prevCursor }) => {
  const { data, fetchPreviousPage, hasPreviousPage } = useInfiniteQuery(
    ['assets', assets, nextCursor, prevCursor],
    ({ pageParam }) => {
      return requestAtClient<InfiniteQueryResponse<Asset>>('/public/asset', {
        query: {
          ...pageParam,
          take: 10,
        },
      });
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

  useFixMinHeight();

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
              triggerOnce={false}
              draggable={false}
            />
          ))}
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
  const pathViewCount = res.headers.get('x-path-view-count');
  const data = await res.json();
  return {
    props: {
      assets: data.resources,
      nextCursor: data.nextCursor,
      prevCursor: data.prevCursor,
      layout: {
        pathViewCount,
      },
      meta: {
        title: '图片墙',
        description: '专门用来放我的二次元老婆',
      },
      link: {
        canonical: `${origin}/gallery`,
      },
    },
  };
};

Gallery.getLayout = (page) => {
  const { pathViewCount } = page.props.layout;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export default Gallery;
