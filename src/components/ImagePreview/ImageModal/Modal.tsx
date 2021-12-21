import type { FC, MouseEvent } from 'react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
  const isWider = useMemo(() => {
    return (
      window.visualViewport.height / window.visualViewport.width >
      Number(image?.size.height) / Number(image?.size.width)
    );
  }, [image]);
  const isWiderThanScreen = useMemo(() => {
    return Number(image?.size.width) >= window.visualViewport.width - 100 * 2;
  }, [image]);
  const isHigherThanScreen = useMemo(() => {
    return Number(image?.size.height) >= window.visualViewport.height;
  }, [image]);

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
  const prevImgUrl = useMemo(
    () => isDefined(selectIndex) && images?.[selectIndex - 1]?.objectUrl,
    [images, selectIndex],
  );
  const nextImgUrl = useMemo(
    () => isDefined(selectIndex) && images?.[selectIndex + 1]?.objectUrl,
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

  const [direction, setDirection] = useState(0);
  const x = useMotionValue(0);

  const showPrevImage = (e?: MouseEvent) => {
    e?.stopPropagation();
    if (isDefined(selectIndex) && enableShowPrevImage) {
      x.stop();
      setDirection(-1);
      // dispatch({
      //   type: ImageModalContextActionType.open,
      //   payload: {
      //     selectIndex: selectIndex - 1,
      //   },
      // });
    }
  };

  const showNextImage = (e?: MouseEvent) => {
    e?.stopPropagation();
    if (isDefined(selectIndex) && enableShowNextImage) {
      x.stop();
      setDirection(1);
      // dispatch({
      //   type: ImageModalContextActionType.open,
      //   payload: {
      //     selectIndex: selectIndex + 1,
      //   },
      // });
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
      <motion.div className="w-full h-full flex justify-center items-center">
        <AnimatePresence initial={false} custom={{ animated, loadingImg, direction }}>
          {prevImgUrl && (
            <motion.img
              key={prevImgUrl}
              className={classNames(styles.image, styles.wFullImage, styles.with, '-left-full')}
              style={{ x }}
              src={prevImgUrl}
            />
          )}
          {nextImgUrl && (
            <motion.img
              key={nextImgUrl}
              className={classNames(styles.image, styles.wFullImage, styles.with, 'left-full')}
              style={{ x }}
              src={nextImgUrl}
            />
          )}
          {isDefined(imgSrc) && (
            <motion.img
              style={{ x }}
              key={imgSrc}
              onAnimationComplete={(label) => {
                if (label === 'animate') {
                  setAnimated(true);
                  if (isDefined(selectIndex)) {
                    if (direction === 1) {
                      dispatch({
                        type: ImageModalContextActionType.open,
                        payload: {
                          selectIndex: selectIndex + 1,
                        },
                      });
                      setDirection(0);
                    }
                    if (direction === -1) {
                      dispatch({
                        type: ImageModalContextActionType.open,
                        payload: {
                          selectIndex: selectIndex - 1,
                        },
                      });
                      setDirection(0);
                    }
                  }
                } else if (label === 'exit') {
                  if (ref.current) {
                    ref.current = false;
                    setLoadingImg(true);
                    setAnimated(false);
                    closeModal();
                  }
                }
              }}
              variants={{
                initial: ({ animated: a, direction: d }) => {
                  if (a) {
                    return {};
                  }
                  return {
                    opacity: 0,
                    filter: 'blur(50px)',
                    scale: 0.3,
                  };
                },
                animate: ({ animated: a, loadingImg: b, direction: d }) => {
                  if (a && !b) {
                    return {
                      zIndex: 1,
                      opacity: 1,
                      filter: 'blur(0)',
                      scale: 1,
                      x: (d === 1 && '-100vw') || (d === -1 && '100vw') || 0,
                    };
                  }
                  return {
                    zIndex: 1,
                    opacity: 1,
                    filter: 'blur(10px)',
                    scale: 1,
                  };
                },
                exit: ({ direction: d, animated: a }) => {
                  if (a && !ref.current) {
                    return {
                      zIndex: 1,
                      x: 0,
                      opacity: 0,
                      scale: 0,
                      transition: { type: false },
                    };
                  }
                  return {
                    zIndex: 0,
                    opacity: 0,
                    scale: 0.7,
                    x: 0,
                  };
                },
              }}
              custom={{
                animated,
                loadingImg,
                direction,
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              className={classNames(styles.image, 'pointer', {
                [styles.wFullImage]: isWider && isWiderThanScreen,
                'h-full': !isWider && isHigherThanScreen,
              })}
              src={imgSrc}
              transition={{
                opacity: { duration: 0.2 },
                x: { duration: 10 },
              }}
              drag="x"
              dragElastic={0.5}
              onDragEnd={(_, { offset, velocity }) => {
                const swipeX = swipePower(offset.x, velocity.x);
                const swipeY = swipePower(offset.y, velocity.y);
                // Math.abs(swipeY) > swipeConfidenceThreshold && fadeImage();
                if (swipeX < -swipeConfidenceThreshold) {
                  showNextImage();
                } else if (swipeX > swipeConfidenceThreshold) {
                  showPrevImage();
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
};
