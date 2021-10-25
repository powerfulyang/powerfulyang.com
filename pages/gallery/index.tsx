import React, { useMemo } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useInfiniteQuery } from 'react-query';
import { flatten, last } from 'ramda';
import { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { clientRequest, request } from '@/utils/request';
import { Asset } from '@/type/Asset';
import styles from './index.module.scss';
import { Masonry } from '@/components/Masonry';
import { LazyImage } from '@/components/LazyImage';
import { CosUtils } from '@/utils/lib';
import { getCurrentUser } from '@/service/getCurrentUser';
import { InfiniteQueryResponse } from '@/type/InfiniteQuery';

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
      <Masonry>
        {resources.map((asset) => (
          <LazyImage
            title={`${asset.id}`}
            key={asset.id}
            assetId={asset.id}
            src={CosUtils.getCosObjectThumbnailUrl(asset.objectUrl)}
            blurSrc={CosUtils.getCosObjectThumbnailBlurUrl(asset.objectUrl)}
            inViewAction={async (id) => {
              if (id === last(resources)?.id) {
                hasNextPage && !isFetching && (await fetchNextPage());
              }
            }}
            width={asset.size.width}
            height={asset.size.height}
          />
        ))}
      </Masonry>
    </main>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
