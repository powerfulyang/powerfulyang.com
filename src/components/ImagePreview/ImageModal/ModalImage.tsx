import classNames from 'classnames';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { assets } from '@powerfulyang/components';
import styles from '@/components/ImagePreview/ImageModal/modal.module.scss';
import type { Asset } from '@/type/Asset';
import { CosUtils } from '@/utils/lib';

type ModalImageProps = {
  asset: Asset;
  selectIndex: number;
  index: number;
  actionRef: any;
  destroy: () => void;
  x: number;
  y: number;
};

export const ModalImage: FC<ModalImageProps> = ({
  asset,
  selectIndex,
  index,
  actionRef,
  destroy,
  x,
  y,
}) => {
  const [url, setUrl] = useState(() => CosUtils.getCosObjectThumbnailUrl(asset.objectUrl));
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const originUrl = CosUtils.getCosObjectUrl(asset.objectUrl);
    if (originUrl) {
      const img = new Image();
      img.src = originUrl;
      img.onload = () => {
        setLoaded(true);
      };
      img.onerror = () => {
        setLoaded(true);
        setUrl(assets.brokenImg);
      };
    }
  }, [asset]);
  const realIndex = selectIndex === 0 ? selectIndex + index : selectIndex - 1 + index;
  const isPrev = selectIndex > realIndex;
  const isNext = selectIndex < realIndex;
  const isMain = selectIndex === realIndex;
  const isWider =
    window.visualViewport.height / (window.visualViewport.width - 100 * 2) >
    Number(asset?.size.height) / Number(asset?.size.width);
  const isWiderThanScreen = Number(asset?.size.width) >= window.visualViewport.width - 100 * 2;
  const isHigherThanScreen = Number(asset?.size.height) >= window.visualViewport.height;

  return (
    <motion.img
      custom={{
        isPrev,
        isNext,
        x,
        loaded,
        y,
      }}
      onAnimationComplete={(label) => {
        if (isMain && label === 'exit') {
          destroy();
        }
        if (label === 'animate' && loaded) {
          setUrl(CosUtils.getCosObjectUrl(asset.objectUrl));
        }
      }}
      variants={{
        initial: () => {
          return {
            opacity: 0,
            filter: 'blur(50px)',
            scale: 0.4,
            x: window.visualViewport.width * (realIndex - selectIndex),
          };
        },
        animate: ({ isPrev: p, isNext: n, x: ox, loaded: l, y: oy }) => {
          const offset: number = (p && -20) || (n && 20) || 0;
          let t = {};
          if (actionRef.current !== 0) {
            t = {
              transition: {
                type: false,
              },
            };
          }
          return {
            x: window.visualViewport.width * (realIndex - selectIndex) + Number(ox) + offset,
            opacity: 1,
            filter: l ? 'blur(0px)' : 'blur(20px)',
            scale: oy ? 1 - oy / window.visualViewport.height : 1,
            y: oy,
            ...t,
          };
        },
        exit: ({ y: oy }) => {
          return {
            x: window.visualViewport.width * (realIndex - selectIndex),
            opacity: 0,
            scale: oy ? 0.3 : 0.8,
          };
        },
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      key={asset.id}
      transition={{ duration: 0.3 }}
      className={classNames(styles.image, 'pointer', {
        [styles.wFullImage]: isWider && isWiderThanScreen,
        'h-full': !isWider && isHigherThanScreen,
      })}
      src={url}
      alt={asset.comment}
      draggable={false}
      onClick={(e) => e.stopPropagation()}
    />
  );
};
