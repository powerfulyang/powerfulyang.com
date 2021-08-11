import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { clientRequest, request } from '@/utils/request';
import { Asset } from '@/types/Asset';
import { ImagePreview } from '@/components/ImagePreview/Index';
import { useImmer } from '@powerfulyang/hooks';
import useSWR from 'swr';
import styles from './index.module.scss';
import { LazyImage } from './LazyImage';

type GalleryProps = {
  assets: Asset[];
};

export const Gallery: LayoutFC<GalleryProps> = ({ assets }) => {
  const [images, setImages] = useImmer(assets);
  const [page, setPage] = useState(2);
  const loadMore = () => {
    setPage((prevState) => {
      return prevState + 1;
    });
  };
  const { data } = useSWR(['/asset', page], async (url, currentPage) => {
    const res = await clientRequest(url, {
      query: { currentPage, pageSize: 30 },
    });
    return res.data[0];
  });

  useEffect(() => {
    if (data) {
      setImages((prev) => {
        prev.push(...data);
      });
    }
  }, [data, setImages]);

  return (
    <>
      <div className={styles.gallery}>
        <ImagePreview>
          {images.map((asset) => (
            <div key={asset.id} className={styles.image_wrap}>
              <LazyImage
                className={styles.image}
                src={asset.objectUrl}
                assetId={asset.id}
                inViewAction={(id) => {
                  if (id === data?.[0]?.id) {
                    loadMore();
                  }
                }}
              />
            </div>
          ))}
        </ImagePreview>
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request('/asset', {
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
