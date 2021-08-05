import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { request } from '@/utils/request';
import { Asset } from '@/types/Asset';
import styles from './index.module.scss';

type GalleryProps = {
  assets: Asset[];
};

export const Gallery: LayoutFC<GalleryProps> = ({ assets }) => {
  return (
    <>
      <div className={styles.gallery}>
        {assets.map((asset) => (
          <img className={styles.image} key={asset.id} src={asset.objectUrl} alt="" />
        ))}
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await request('/asset', {
    ctx,
  });
  const { data } = await res.json();
  return {
    props: {
      assets: data[0],
    },
  };
};

Gallery.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default Gallery;
