import type { FC } from 'react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@powerfulyang/components';
import { isDefined, isUndefined } from '@powerfulyang/utils';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';
import { CosUtils } from '@/utils/lib';
import styles from './modal.module.scss';

type ImageModalContentProps = {};

export const ImageModalContent: FC<ImageModalContentProps> = () => {
  const {
    state: { images, selectIndex },
    dispatch,
  } = useContext(ImageModalContext);
  const [imgSrc, setImgSrc] = useState<string>();
  const [animated, setAnimated] = useState<boolean>(false);
  const closeModal = () => {
    dispatch({
      type: ImageModalContextActionType.close,
    });
  };
  const imgUrl = useMemo(
    () => isDefined(selectIndex) && images?.[selectIndex]?.objectUrl,
    [images, selectIndex],
  );
  const [loadingImg, setLoadingImg] = useState(true);
  useEffect(() => {
    animated &&
      !loadingImg &&
      imgUrl &&
      setImgSrc((prevState) => {
        if (isDefined(prevState)) {
          return CosUtils.getCosObjectUrl(imgUrl);
        }
        return prevState;
      });
  }, [animated, imgUrl, loadingImg]);
  useEffect(() => {
    if (imgUrl) {
      const img = new Image();
      img.onload = () => {
        setLoadingImg(false);
      };
      img.src = CosUtils.getCosObjectUrl(imgUrl)!;
      setImgSrc(CosUtils.getCosObjectThumbnailUrl(imgUrl));
    }
  }, [imgUrl]);

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
  const touchRef = useRef<number[]>([]);
  const enableShowPrevImage = useMemo(() => {
    if (isDefined(imgSrc) && isDefined(selectIndex)) {
      return selectIndex > 0;
    }
    return false;
  }, [imgSrc, selectIndex]);

  const enableShowNextImage = useMemo(() => {
    if (isDefined(imgSrc) && images && isDefined(selectIndex)) {
      return selectIndex < images.length - 1;
    }
    return false;
  }, [images, imgSrc, selectIndex]);
  return (
    <div
      className={classNames(styles.wrap, {
        [styles.clear]: isUndefined(selectIndex),
      })}
      onTouchStart={(e) => {
        touchRef.current = [e.touches[0].clientX, e.touches[0].clientY];
      }}
      onTouchEnd={(e) => {
        const [startX, startY] = touchRef.current;
        const [endX, endY] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        const distanceX = endX - startX;
        const distanceY = endY - startY;
        if (Math.abs(distanceX) > Math.abs(distanceY)) {
          if (distanceX > 0) {
            enableShowPrevImage && showPrevImage();
          } else {
            enableShowNextImage && showNextImage();
          }
        } else {
          setImgSrc(undefined);
        }
      }}
    >
      {enableShowPrevImage && (
        <Icon
          key={`${selectIndex}-prev`}
          type="icon-arrow-left"
          className={styles.prev}
          onClick={showPrevImage}
        />
      )}
      {enableShowNextImage && (
        <Icon
          key={`${selectIndex}-next`}
          type="icon-arrow-right"
          className={styles.next}
          onClick={showNextImage}
        />
      )}
      <div className="sm:px-20 w-full h-full">
        <AnimatePresence>
          {isDefined(imgSrc) && (
            <motion.img
              onAnimationComplete={(label) => {
                if (label === 'complete') {
                  setAnimated(true);
                } else if (label === 'exit') {
                  setLoadingImg(true);
                  setAnimated(false);
                  closeModal();
                }
              }}
              variants={{
                initial: {
                  opacity: 0,
                  filter: 'blur(50px)',
                  scale: 0.3,
                },
                complete: {
                  opacity: 1,
                  filter: 'blur(10px)',
                  scale: 1,
                },
                loaded: {
                  opacity: 1,
                  filter: 'blur(0)',
                  scale: 1,
                  transition: {
                    type: false,
                  },
                },
                exit: {
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.3 },
                },
              }}
              initial="initial"
              animate={animated && !loadingImg ? 'loaded' : 'complete'}
              exit="exit"
              className={classNames(styles.image, 'pointer')}
              src={imgSrc}
              onClick={() => {
                setImgSrc(undefined);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
