import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useImmer } from '@powerfulyang/hooks';
import { useQuery } from 'react-query';
import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { clientRequest, request } from '@/utils/request';
import { Asset } from '@/types/Asset';
import styles from './index.module.scss';
import { Masonry } from '@/components/Masonry';
import { LazyImage } from '@/components/LazyImage';
import { CosUtils } from '@/utils/lib';
import { getCurrentUser } from '@/service/getCurrentUser';

type GalleryProps = {
  assets: Asset[];
};

export const Gallery: LayoutFC<GalleryProps> = ({ assets }) => {
  const [images, setImages] = useImmer(assets);
  const [page, setPage] = useState(2);
  const [reqUrl] = useState(() => '/public/asset');
  const [noMore, setNoMore] = useState(false);
  const loadMore = () => {
    if (!noMore) {
      setPage((prevState) => {
        return prevState + 1;
      });
    }
  };
  const { data } = useQuery([reqUrl, page], async () => {
    const res = await clientRequest<[Asset[]]>(reqUrl, {
      query: { currentPage: page, pageSize: 30 },
    });
    return res.data[0];
  });

  useEffect(() => {
    if (data) {
      if (!data.length) {
        setNoMore(true);
      }
      setImages((prev) => {
        prev.push(...data);
      });
    }
  }, [data, setImages]);

  return (
    <main className={styles.gallery}>
      <Masonry>
        {images.map((asset) => (
          <LazyImage
            key={asset.id}
            assetId={asset.id}
            src={CosUtils.getCosObjectThumbnailUrl(asset.objectUrl)}
            blurSrc={CosUtils.getCosObjectThumbnailBlurUrl(asset.objectUrl)}
            inViewAction={(id) => {
              if (data && id === data[0].id) {
                loadMore();
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
  const res = await request('/public/asset', {
    ctx,
    query: {
      pageSize: 30,
    },
  });
  const { data, pathViewCount } = await res.json();
  const user = await getCurrentUser(ctx);
  return {
    props: {
      assets: data[0],
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
