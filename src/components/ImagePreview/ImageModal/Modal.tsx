import type { FC, MouseEvent, TouchEvent } from 'react';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@powerfulyang/components';
import { isDefined, isUndefined } from '@powerfulyang/utils';
import { fromEvent } from 'rxjs';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';
import styles from './modal.module.scss';
import { ModalImage } from '@/components/ImagePreview/ImageModal/ModalImage';

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
  const [y, setY] = useState(0);
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
    startPositionRef.current = [clientX, clientY];
    actionRef.current = 3;
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
    const [startX, startY] = startPositionRef.current;
    let offsetX: number;
    let offsetY: number;
    if ('changedTouches' in e) {
      const { clientX, clientY } = e.changedTouches && e.changedTouches[0];
      offsetX = clientX - startX;
      offsetY = clientY - startY;
    } else {
      const { clientX, clientY } = e;
      offsetX = clientX - startX;
      offsetY = clientY - startY;
    }
    if (actionRef.current === 3 && Math.abs(offsetX) > Math.abs(offsetY)) {
      actionRef.current = 1;
    }
    if (actionRef.current === 3 && Math.abs(offsetX) < Math.abs(offsetY)) {
      actionRef.current = 2;
    }
    if (actionRef.current === 1) {
      setX(offsetX / 2);
    }
    if (actionRef.current === 2 && offsetY > 0) {
      setY(offsetY / 2);
    }
  };

  const onTouchEnd = () => {
    actionRef.current = 0;
    if (x > 50) {
      showPrevImage();
    } else if (x < -50) {
      showNextImage();
    }
    setX(0);
    if (y > 50) {
      setOpen(false);
    } else {
      setY(0);
    }
  };

  const fadeOutImage = () => {
    setOpen(false);
  };

  const destroy = () => {
    dispatch({
      type: ImageModalContextActionType.close,
    });
    setOpen(true);
    setY(0);
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
      className={classNames(
        styles.wrap,
        {
          [styles.clear]: isUndefined(selectIndex),
        },
        'pointer',
      )}
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
                return (
                  open && (
                    <ModalImage
                      key={asset.id}
                      actionRef={actionRef}
                      asset={asset}
                      selectIndex={selectIndex}
                      index={index}
                      destroy={destroy}
                      x={x}
                      y={y}
                    />
                  )
                );
              })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
