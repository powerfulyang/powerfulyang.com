import React, { useMemo } from 'react';
import type { GetServerSideProps } from 'next';
import { useInfiniteQuery } from 'react-query';
import { flatten, last } from 'ramda';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { clientRequest, request } from '@/utils/request';
import type { Asset } from '@/type/Asset';
import styles from './index.module.scss';
import { Masonry } from '@/components/Masonry';
import { getCurrentUser } from '@/service/getCurrentUser';
import type { InfiniteQueryResponse } from '@/type/InfiniteQuery';
import { AssetImageThumbnail } from '@/components/ImagePreview/AssetImageThumbnail';
import { ImagePreview } from '@/components/ImagePreview';

type GalleryProps = {
  assets: Asset[];
};

export const Gallery: LayoutFC<GalleryProps> = ({ assets }) => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery(
    'assets',
    async ({ pageParam }) => {
      const res = await clientRequest<InfiniteQueryResponse<Asset>>('/public/asset/infiniteQuery', {
        query: { id: pageParam || last(assets)?.id, size: 30 },
      });
      return res.data;
    },
    {
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
              id={String(asset.id)}
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
              style={{
                aspectRatio: `${asset.size.width} / ${asset.size.height}`,
              }}
            />
          ))}
        </Masonry>
      </ImagePreview>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await request('/public/asset/infiniteQuery', {
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
