import type { Asset } from '@/__generated__/api';
import { origin } from '@/components/Head';
import {
  castAssetsToImagePreviewItem,
  ImagePreview,
  ImagePreviewAction,
} from '@/components/ImagePreview';
import { LazyAssetImage } from '@/components/LazyImage/LazyAssetImage';
import Masonry from '@/components/Masonry';
import { UserLayout } from '@/layout/UserLayout';
import { clientApi, serverApi } from '@/request/requestTool';
import type { LayoutFC } from '@/types/GlobalContext';
import { checkAuthInfo, extractRequestHeaders } from '@/utils/extractRequestHeaders';
import { firstItem, isEmpty, lastItem } from '@powerfulyang/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { kv } from '@vercel/kv';
import { flatten } from 'lodash-es';
import type { GetServerSideProps } from 'next';
import React, { useCallback } from 'react';
import styles from './index.module.scss';

type GalleryProps = {
  assets: Asset[];
  nextCursor: number;
  prevCursor: number;
};

export const Gallery: LayoutFC<GalleryProps> = ({ assets, nextCursor, prevCursor }) => {
  const { data, fetchPreviousPage, hasPreviousPage, isFetching, isError } = useInfiniteQuery({
    queryKey: ['assets', assets, nextCursor, prevCursor],
    queryFn: ({ pageParam }) => {
      return clientApi
        .infiniteQueryPublicAsset({
          ...pageParam,
          take: 10,
        })
        .then((x) => x.data);
    },
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
  });

  const resources = flatten(data?.pages.map((x) => x.resources) || []);

  const images = castAssetsToImagePreviewItem(resources);

  const itemRender = useCallback(
    (item: Asset, index: number) => (
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
    ),
    [],
  );

  return (
    <main className={styles.gallery}>
      <ImagePreview images={images}>
        <Masonry
          onLoadMore={() => {
            hasPreviousPage && fetchPreviousPage();
          }}
          data={resources}
          itemRender={itemRender}
        />
      </ImagePreview>
      {!isError && !isFetching && !hasPreviousPage && !isEmpty(resources) && (
        <div className="flex justify-center pb-6 sm:pb-0">已经到达世界的尽头...</div>
      )}
      {isFetching && (
        <div className="flex justify-center pb-6 sm:pb-0">
          <div className={styles.loading}>Loading</div>
        </div>
      )}
      {isError && (
        <div className="flex justify-center pb-6 sm:pb-0">
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
      {isEmpty(resources) && !isFetching && !isError && (
        <div className="flex justify-center pb-6 sm:pb-0">这里只有一片虚无...</div>
      )}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const requestHeaders = extractRequestHeaders(ctx.req.headers);
  const hasAuthInfo = checkAuthInfo(requestHeaders);

  if (!hasAuthInfo) {
    try {
      const _ = await kv.get<any>(`props:gallery:index`);
      if (_) {
        return _;
      }
    } catch (e) {
      // ignore
    }
  }

  const res = await serverApi.infiniteQueryPublicAsset(
    {
      take: 20,
    },
    {
      headers: requestHeaders,
    },
  );
  const pathViewCount = res.headers.get('x-path-view-count');
  const { data } = res;
  const props = {
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
  if (!hasAuthInfo) {
    try {
      // await kv.set(`props:gallery:index`, props);
    } catch (e) {
      // ignore
    }
  }
  return props;
};

Gallery.getLayout = (page) => {
  const { pathViewCount } = page.props.layout;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export default Gallery;

export const runtime = 'experimental-edge';
