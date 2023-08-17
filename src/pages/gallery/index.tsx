import React, { useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import { useInfiniteQuery } from '@tanstack/react-query';
import { flatten } from 'lodash-es';
import { firstItem, lastItem } from '@powerfulyang/utils';
import type { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import { castAssetsToImagePreviewItem, ImagePreview } from '@/components/ImagePreview';
import Masonry from '@/components/Masonry';
import { origin } from '@/components/Head';
import type { Asset } from '@/__generated__/api';
import { clientApi, serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
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
      retry: false,
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await serverApi.infiniteQueryPublicAsset(
    {
      take: 20,
    },
    {
      headers: extractRequestHeaders(ctx.req.headers),
    },
  );
  const pathViewCount = res.headers.get('x-path-view-count');
  const { data } = res;
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
