import type { FC, MouseEvent, TouchEvent } from 'react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Icon } from '@powerfulyang/components';
import { isDefined, isUndefined } from '@powerfulyang/utils';
import { fromEvent } from 'rxjs';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';
import { CosUtils } from '@/utils/lib';
import styles from './modal.module.scss';

type ImageModalContentProps = {};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const ImageModalContent: FC<ImageModalContentProps> = () => {
  const {
    state: { images, selectIndex },
    dispatch,
  } = useContext(ImageModalContext);
  const image = useMemo(() => {
    if (isDefined(images) && isDefined(selectIndex)) {
      return images[selectIndex];
    }
    return null;
  }, [images, selectIndex]);

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
      imgUrl &&
      setImgSrc((prevState) => {
        if (isDefined(prevState)) {
          return CosUtils.getCosObjectUrl(imgUrl);
        }
        return prevState;
      });
  }, [animated, imgUrl]);
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

  const showPrevImage = (e?: MouseEvent) => {
    e?.stopPropagation();
    if (isDefined(selectIndex) && enableShowPrevImage) {
      dispatch({
        type: ImageModalContextActionType.open,
        payload: {
          selectIndex: selectIndex - 1,
        },
      });
    }
  };

  const showNextImage = (e?: MouseEvent) => {
    e?.stopPropagation();
    if (isDefined(selectIndex) && enableShowNextImage) {
      dispatch({
        type: ImageModalContextActionType.open,
        payload: {
          selectIndex: selectIndex + 1,
        },
      });
    }
  };

  const ref = useRef(false);
  const fadeImage = () => {
    ref.current = true;
    setImgSrc(undefined);
  };

  useEffect(() => {
    const subscription = fromEvent<KeyboardEvent>(document, 'keydown').subscribe((e) => {
      if (e.code === 'Escape' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        fadeImage();
      }
      if (e.code === 'ArrowLeft') {
        showPrevImage();
      }
      if (e.code === 'ArrowRight') {
        showNextImage();
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  });

  const [x, setX] = useState(0);
  const startPositionRef = useRef<[number, number]>([0, 0]);
  /**
   * 1 代表横向移动
   * 2 代表纵向移动
   */
  const actionRef = useRef(0);

  const onTouchStart = (e: TouchEvent<HTMLImageElement> | MouseEvent<HTMLImageElement>) => {
    let clientX = 0;
    let clientY = 0;
    if ('changedTouches' in e) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    actionRef.current = 1;
    startPositionRef.current = [clientX, clientY];
  };

  const onTouchMove = (e: TouchEvent<HTMLImageElement> | MouseEvent<HTMLImageElement>) => {
    const [startX, startY] = startPositionRef.current;
    let offsetX = 0;
    if ('changedTouches' in e) {
      const { clientX, clientY } = e.changedTouches && e.changedTouches[0];
      offsetX = clientX - startX;
    } else {
      const { clientX, clientY } = e;
      offsetX = clientX - startX;
    }
    if (actionRef.current === 1) {
      setX(offsetX);
    }
  };

  const onTouchEnd = () => {
    actionRef.current = 0;
  };

  return (
    <button
      type="button"
      className={classNames(styles.wrap, {
        [styles.clear]: isUndefined(selectIndex),
      })}
      onClick={fadeImage}
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
      <motion.div className="w-full h-full flex justify-center items-center flex-nowrap overflow-hidden">
        {isDefined(images) &&
          isDefined(selectIndex) &&
          images
            .slice(Math.max(0, selectIndex - 1), Math.min(selectIndex + 2, images.length + 1))
            .map((asset, index) => {
              const url = CosUtils.getCosObjectUrl(asset.objectUrl);
              const realIndex = selectIndex === 0 ? selectIndex + index : selectIndex - 1 + index;
              const isPrev = selectIndex > realIndex;
              const isNext = selectIndex < realIndex;
              const isWider =
                window.visualViewport.height / window.visualViewport.width >
                Number(asset?.size.height) / Number(asset?.size.width);
              const isWiderThanScreen =
                Number(asset?.size.width) >= window.visualViewport.width - 100 * 2;
              const isHigherThanScreen = Number(asset?.size.height) >= window.visualViewport.height;
              return (
                <motion.img
                  custom={{
                    isPrev,
                    isNext,
                    x,
                  }}
                  variants={{
                    animate: ({ isPrev: p, isNext: n }) => {
                      if (p) {
                        return {
                          x: window.visualViewport.width * (realIndex - selectIndex) + x,
                        };
                      }
                      if (n) {
                        return {
                          x: window.visualViewport.width * (realIndex - selectIndex) + x,
                        };
                      }
                      return { x: window.visualViewport.width * (realIndex - selectIndex) + x };
                    },
                  }}
                  initial="animate"
                  animate="animate"
                  key={asset.id}
                  className={classNames(styles.image, 'pointer', {
                    [styles.wFullImage]: isWider && isWiderThanScreen,
                    'h-full': !isWider && isHigherThanScreen,
                  })}
                  src={url}
                  alt={asset.comment}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onMouseDown={onTouchStart}
                  onMouseMove={onTouchMove}
                  onMouseUp={onTouchEnd}
                  draggable={false}
                />
              );
            })}
      </motion.div>
    </button>
  );
};
