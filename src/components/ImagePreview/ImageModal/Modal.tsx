import type { FC, MouseEvent, TouchEvent } from 'react';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@powerfulyang/components';
import { isDefined, isUndefined } from '@powerfulyang/utils';
import { fromEvent } from 'rxjs';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';
import { CosUtils } from '@/utils/lib';
import styles from './modal.module.scss';

type ImageModalContentProps = {};

export const ImageModalContent: FC<ImageModalContentProps> = () => {
  const [open, setOpen] = useState(true);
  const {
    state: { images, selectIndex },
    dispatch,
  } = useContext(ImageModalContext);

  const enableShowPrevImage = useMemo(() => {
    if (isDefined(selectIndex) && open) {
      return selectIndex > 0;
    }
    return false;
  }, [open, selectIndex]);

  const enableShowNextImage = useMemo(() => {
    if (images && isDefined(selectIndex) && open) {
      return selectIndex < images.length - 1;
    }
    return false;
  }, [images, open, selectIndex]);

  const showPrevImage = useCallback(
    (e?: MouseEvent) => {
      e?.stopPropagation();
      if (isDefined(selectIndex) && enableShowPrevImage) {
        dispatch({
          type: ImageModalContextActionType.open,
          payload: {
            selectIndex: selectIndex - 1,
          },
        });
      }
    },
    [dispatch, enableShowPrevImage, selectIndex],
  );

  const showNextImage = useCallback(
    (e?: MouseEvent) => {
      e?.stopPropagation();
      if (isDefined(selectIndex) && enableShowNextImage) {
        dispatch({
          type: ImageModalContextActionType.open,
          payload: {
            selectIndex: selectIndex + 1,
          },
        });
      }
    },
    [dispatch, enableShowNextImage, selectIndex],
  );

  const [x, setX] = useState(0);
  const startPositionRef = useRef<[number, number]>([0, 0]);
  /**
   * 1 代表横向移动
   * 2 代表纵向移动
   */
  const actionRef = useRef(0);

  const onTouchStart = (e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
    let clientX: number;
    let clientY: number;
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

  const onTouchMove = (e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
    // TODO: Y 轴滑动
    const [startX] = startPositionRef.current;
    let offsetX: number;
    if ('changedTouches' in e) {
      const { clientX } = e.changedTouches && e.changedTouches[0];
      offsetX = clientX - startX;
    } else {
      const { clientX } = e;
      offsetX = clientX - startX;
    }
    if (actionRef.current === 1) {
      setX(offsetX / 2);
    }
  };

  const onTouchEnd = () => {
    actionRef.current = 0;
    if (x > 20) {
      showPrevImage();
    } else if (x < -20) {
      showNextImage();
    }
    setX(0);
  };

  const fadeOutImage = () => {
    setOpen(false);
  };

  const destroy = () => {
    dispatch({
      type: ImageModalContextActionType.close,
    });
    setOpen(true);
  };

  useEffect(() => {
    const subscription = fromEvent<KeyboardEvent>(document, 'keydown').subscribe((e) => {
      if (e.code === 'Escape' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        fadeOutImage();
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
  }, [showNextImage, showPrevImage]);

  return (
    <div
      role="presentation"
      className={classNames(styles.wrap, {
        [styles.clear]: isUndefined(selectIndex),
      })}
      onClick={fadeOutImage}
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
      <motion.div
        className="w-full h-full flex justify-center items-center flex-nowrap overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
      >
        <AnimatePresence initial={false}>
          {isDefined(images) &&
            isDefined(selectIndex) &&
            images
              .slice(Math.max(0, selectIndex - 1), Math.min(selectIndex + 2, images.length + 1))
              .map((asset, index) => {
                const url = CosUtils.getCosObjectUrl(asset.objectUrl);
                const realIndex = selectIndex === 0 ? selectIndex + index : selectIndex - 1 + index;
                const isPrev = selectIndex > realIndex;
                const isNext = selectIndex < realIndex;
                const isMain = selectIndex === realIndex;
                const isWider =
                  window.visualViewport.height / (window.visualViewport.width - 100 * 2) >
                  Number(asset?.size.height) / Number(asset?.size.width);
                const isWiderThanScreen =
                  Number(asset?.size.width) >= window.visualViewport.width - 100 * 2;
                const isHigherThanScreen =
                  Number(asset?.size.height) >= window.visualViewport.height;
                return (
                  open && (
                    <motion.img
                      custom={{
                        isPrev,
                        isNext,
                        x,
                      }}
                      onAnimationComplete={(label) => {
                        if (isMain && label === 'exit') {
                          destroy();
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
                        animate: ({ isPrev: p, isNext: n, x: ox }) => {
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
                            x:
                              window.visualViewport.width * (realIndex - selectIndex) +
                              Number(ox) +
                              offset,
                            opacity: 1,
                            filter: 'blur(0px)',
                            scale: 1,
                            ...t,
                          };
                        },
                        exit: () => {
                          return {
                            x: window.visualViewport.width * (realIndex - selectIndex),
                            opacity: 0,
                            scale: 0.8,
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
                  )
                );
              })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
