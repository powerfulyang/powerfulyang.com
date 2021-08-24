import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { clientRequest, request } from '@/utils/request';
import { Asset } from '@/types/Asset';
import { ImagePreview } from '@/components/ImagePreview/Index';
import { useImmer } from '@powerfulyang/hooks';
import useSWR from 'swr';
import { LazyImage } from '@/components/LazyImage';
import { last } from 'ramda';
import styles from './index.module.scss';

type GalleryProps = {
  assets: Asset[];
};

export const Gallery: LayoutFC<GalleryProps> = ({ assets }) => {
  const [images, setImages] = useImmer(assets);
  const [page, setPage] = useState(2);
  const [noMore, setNoMore] = useState(false);
  const loadMore = () => {
    if (!noMore) {
      setPage((prevState) => {
        return prevState + 1;
      });
    }
  };
  const { data } = useSWR(['/public/gallery', page], async (url, currentPage) => {
    const res = await clientRequest<[Asset[]]>(url, {
      query: { currentPage, pageSize: 30 },
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
      <ImagePreview>
        {images.map((asset) => (
          <div key={asset.id} data-img={asset.objectUrl} className={styles.image_wrap}>
            <LazyImage
              className={styles.image}
              src={asset.objectUrl}
              assetId={asset.id}
              inViewAction={(id) => {
                if (data && id === last(data)?.id) {
                  loadMore();
                }
              }}
            />
          </div>
        ))}
      </ImagePreview>
    </main>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request('/public/gallery', {
    ctx,
    query: {
      pageSize: 30,
    },
  });
  const { data, pathViewCount } = await res.json();
  return {
    props: {
      assets: data[0],
      pathViewCount,
    },
  };
};

Gallery.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export default Gallery;
