import React, { FC, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Icon } from '@powerfulyang/components';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';
import { CosUtils } from '@/utils/lib';
import styles from './modal.module.scss';

type ImageModalContentProps = {};

export const ImageModalContent: FC<ImageModalContentProps> = () => {
  const {
    state: { images, selectIndex },
    dispatch,
  } = useContext(ImageModalContext);
  const closeModal = () => {
    dispatch({
      type: ImageModalContextActionType.close,
    });
  };
  const imgUrl = images?.[selectIndex!]?.objectUrl;
  const [loadingImg, setLoadingImg] = useState(true);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLoadingImg(false);
    };
    if (imgUrl) {
      img.src = CosUtils.getCosObjectUrl(imgUrl)!;
    }
  }, [imgUrl]);
  const [imgSrc, setImgSrc] = useState<string>();
  const [animating, setAnimating] = useState(true);
  useEffect(() => {
    setLoadingImg(true);
    setAnimating(true);
  }, [imgUrl]);
  useEffect(() => {
    if (imgUrl) {
      if (animating) {
        setImgSrc(CosUtils.getCosObjectThumbnailUrl(imgUrl)!);
      } else {
        setImgSrc(CosUtils.getCosObjectUrl(imgUrl)!);
      }
    }
  }, [imgUrl, animating]);
  const showPrevImage = () => {
    dispatch({
      type: ImageModalContextActionType.open,
      payload: {
        selectIndex: selectIndex! - 1,
      },
    });
  };
  const showNextImage = () => {
    dispatch({
      type: ImageModalContextActionType.open,
      payload: {
        selectIndex: selectIndex! + 1,
      },
    });
  };
  return (
    <div className={classNames(styles.wrap)}>
      {selectIndex !== 0 && (
        <Icon type="icon-arrow-left" className={styles.prev} onClick={showPrevImage} />
      )}
      {selectIndex !== Number(images?.length) - 1 && (
        <Icon type="icon-arrow-right" className={styles.next} onClick={showNextImage} />
      )}
      <div className={styles.blur}>
        <motion.img
          variants={{
            initial: {
              filter: 'blur(20px)',
              scale: 0.3,
            },
            loadingImg: {
              filter: 'blur(10px)',
              scale: 1,
            },
            complete: {
              filter: 'blur(0px)',
              scale: 1,
            },
          }}
          animate={
            (selectIndex === undefined && 'initial') ||
            (loadingImg && 'loadingImg') ||
            (!loadingImg && 'complete')
          }
          className={classNames(styles.image, 'cursor-pointer')}
          src={imgSrc}
          onClick={closeModal}
          transition={{ duration: 0.5 }}
          onAnimationComplete={(v) => {
            if (v === 'complete') {
              setAnimating(false);
            }
          }}
        />
      </div>
    </div>
  );
};
