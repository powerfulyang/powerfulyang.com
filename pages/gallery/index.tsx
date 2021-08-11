import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Asset } from '@/types/Asset';
import { ImagePreview } from '@/components/ImagePreview/Index';
import styles from './index.module.scss';

type GalleryProps = {
  assets: Asset[];
};

export const Gallery: LayoutFC<GalleryProps> = ({ assets }) => {
  return (
    <>
      <div className={styles.gallery}>
        <ImagePreview>
          {assets.map((asset) => (
            <div key={asset.id} className={styles.image_wrap}>
              <img className={styles.image} src={asset.objectUrl} alt="" />
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
      pageSize: 100,
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
