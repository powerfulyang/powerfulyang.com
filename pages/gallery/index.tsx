import React, { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { useImmer } from '@powerfulyang/hooks';
import { constants } from 'http2';
import useSWRImmutable from 'swr/immutable';
import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { clientRequest, request } from '@/utils/request';
import { Asset } from '@/types/Asset';
import { ImagePreview } from '@/components/ImagePreview';
import { ImageThumbnailWrap } from '@/components/ImagePreview/ImageThumbnailWrap';
import styles from './index.module.scss';

type GalleryProps = {
  assets: Asset[];
  isPublic: boolean;
};

export const Gallery: LayoutFC<GalleryProps> = ({ assets, isPublic }) => {
  const [images, setImages] = useImmer(assets);
  const [page, setPage] = useState(2);
  const [reqUrl] = useState(() => (isPublic ? '/public/asset' : '/asset'));
  const [noMore, setNoMore] = useState(false);
  const loadMore = () => {
    if (!noMore) {
      setPage((prevState) => {
        return prevState + 1;
      });
    }
  };
  const { data } = useSWRImmutable([reqUrl, page], async (url, currentPage) => {
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
      <ImagePreview images={images}>
        {images.map((asset) => (
          <ImageThumbnailWrap
            key={asset.id}
            asset={asset}
            inViewAction={(id) => {
              if (data && id === data[0].id) {
                loadMore();
              }
            }}
          />
        ))}
      </ImagePreview>
    </main>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  let isPublic = true;
  const t = await request('/user/current', { ctx });
  if (t.status === constants.HTTP_STATUS_OK) {
    isPublic = false;
  }
  const res = await request(isPublic ? '/public/asset' : '/asset', {
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
      isPublic,
      title: '图片墙',
    },
  };
};

Gallery.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export default Gallery;
