import React, { useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import { useInfiniteQuery } from 'react-query';
import { flatten, last } from 'ramda';
import { isDefined } from '@powerfulyang/utils';
import dynamic from 'next/dynamic';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { requestAtClient } from '@/utils/client';
import type { Asset } from '@/type/Asset';
import styles from './index.module.scss';
import { getCurrentUser } from '@/service/getCurrentUser';
import type { InfiniteQueryResponse } from '@/type/InfiniteQuery';
import { AssetImageThumbnail } from '@/components/ImagePreview/AssetImageThumbnail';
import { ImagePreview } from '@/components/ImagePreview';
import { requestAtServer } from '@/utils/server';

type GalleryProps = {
  assets: Asset[];
  nextCursor: string;
};

const Masonry = dynamic(() => import('@/components/Masonry'), { ssr: false });

export const Gallery: LayoutFC<GalleryProps> = ({ assets, nextCursor }) => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    'assets',
    async ({ pageParam }) => {
      const res = await requestAtClient<InfiniteQueryResponse<Asset>>('/public/asset', {
        query: { cursor: pageParam || nextCursor, size: 30 },
      });
      return res.data;
    },
    {
      enabled: isDefined(nextCursor),
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  const resources = useMemo(
    () => [...assets, ...((data?.pages && flatten(data?.pages.map((x) => x.resources))) || [])],
    [assets, data?.pages],
  );

  return (
    <main className={styles.gallery}>
      <ImagePreview parentControl={false} images={resources}>
        <Masonry>
          {resources.map((asset) => (
            <AssetImageThumbnail
              id={`${asset.id}`}
              title={`${asset.id}`}
              key={asset.id}
              assetId={asset.id}
              asset={asset}
              inViewAction={async (id) => {
                if (id === last(resources)?.id) {
                  hasNextPage && !isFetching && (await fetchNextPage());
                }
              }}
              containerClassName="rounded-lg"
              keepAspectRatio
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
      size: 30,
    },
  });
  const { data, pathViewCount } = await res.json();
  const user = await getCurrentUser(ctx);
  return {
    props: {
      assets: data.resources,
      pathViewCount,
      title: '图片墙',
      user,
      nextCursor: data.nextCursor,
    },
  };
};

Gallery.getLayout = (page) => {
  const { pathViewCount, user } = page.props;
  return (
    <UserLayout user={user} pathViewCount={pathViewCount}>
      {page}
    </UserLayout>
  );
};

export default Gallery;
