import type { FC } from 'react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@powerfulyang/components';
import { isDefined } from '@powerfulyang/utils';
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
  const imgUrl = useMemo(
    () => isDefined(selectIndex) && images?.[selectIndex]?.objectUrl,
    [images, selectIndex],
  );
  const [animated, setAnimated] = useState(false);
  const [loadingImg, setLoadingImg] = useState(true);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      // setLoadingImg(false);
    };
    if (imgUrl) {
      img.src = CosUtils.getCosObjectUrl(imgUrl)!;
    }
  }, [imgUrl]);
  const [imgSrc, setImgSrc] = useState<string>();
  useEffect(() => {
    setLoadingImg(true);
  }, [imgUrl]);
  useEffect(() => {
    if (imgUrl) {
      if (loadingImg) {
        setImgSrc(CosUtils.getCosObjectThumbnailUrl(imgUrl));
      } else if (animated) {
        setImgSrc(CosUtils.getCosObjectUrl(imgUrl));
      }
    }
  }, [animated, imgUrl, loadingImg]);
  const showPrevImage = () => {
    if (isDefined(selectIndex)) {
      dispatch({
        type: ImageModalContextActionType.open,
        payload: {
          selectIndex: selectIndex - 1,
        },
      });
    }
  };

  const showNextImage = () => {
    if (isDefined(selectIndex)) {
      dispatch({
        type: ImageModalContextActionType.open,
        payload: {
          selectIndex: selectIndex + 1,
        },
      });
    }
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
        <AnimatePresence>
          {isDefined(selectIndex) && (
            <motion.img
              onAnimationComplete={(label) => {
                if (label === 'complete') {
                  setAnimated(true);
                }
              }}
              variants={{
                initial: {
                  filter: 'blur(20px)',
                  scale: 0.3,
                },
                complete: {
                  filter: 'blur(0px)',
                  scale: 1,
                },
              }}
              initial="initial"
              animate="complete"
              className={classNames(styles.image, 'pointer')}
              src={imgSrc}
              onClick={closeModal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
