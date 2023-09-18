import type { FC, MouseEvent, TouchEvent } from 'react';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@powerfulyang/components';
import { isDefined } from '@powerfulyang/utils';
import { fromEvent } from 'rxjs';
import { ImagePreviewContext, ImagePreviewContextActionType } from '@/context/ImagePreviewContext';
import { ImageModal } from '@/components/ImagePreview/ImagePreviewModal/ImageModal';
import styles from './content.module.scss';

type ImageViewContentProps = {};

export const ImageViewContent: FC<ImageViewContentProps> = () => {
  const [open, setOpen] = useState(false);
  const {
    state: { selectIndex },
    dispatch,
    images,
  } = useContext(ImagePreviewContext);

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
          type: ImagePreviewContextActionType.open,
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
          type: ImagePreviewContextActionType.open,
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

  const onTouchStart = useCallback((e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
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
  }, []);

  const onTouchMove = useCallback((e: TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>) => {
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
  }, []);

  const onTouchEnd = useCallback(() => {
    actionRef.current = 0;
    if (x > 20) {
      showPrevImage();
    } else if (x < -20) {
      showNextImage();
    }
    setX(0);
    if (y > 20) {
      setOpen(false);
    } else {
      setY(0);
    }
  }, [showNextImage, showPrevImage, x, y]);

  const fadeOutImage = useCallback(() => {
    setOpen(false);
  }, []);

  const destroy = useCallback(
    (index: number) => {
      dispatch({
        type: ImagePreviewContextActionType.close,
        payload: {
          selectIndex: index,
        },
      });
    },
    [dispatch],
  );

  useEffect(() => {
    if (isDefined(selectIndex)) {
      setOpen(true);
      setY(0);
    }
  }, [selectIndex]);

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
  }, [fadeOutImage, showNextImage, showPrevImage]);

  return (
    <motion.div
      role="dialog"
      className={classNames(
        styles.wrap,
        {
          [styles.clear]: !open,
        },
        'pointer',
      )}
      onClick={fadeOutImage}
    >
      {enableShowPrevImage && isDefined(selectIndex) && (
        <Icon
          key={`${selectIndex}-prev`}
          type="icon-arrow-left"
          className={styles.prev}
          onClick={showPrevImage}
        />
      )}
      {enableShowNextImage && isDefined(selectIndex) && (
        <Icon
          key={`${selectIndex}-next`}
          type="icon-arrow-right"
          className={styles.next}
          onClick={showNextImage}
        />
      )}
      <motion.div
        className="flex h-full w-full flex-nowrap items-center justify-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        // onMouseDown={onTouchStart}
        // onMouseMove={onTouchMove}
        // onMouseUp={onTouchEnd}
      >
        <AnimatePresence initial={false}>
          {isDefined(images) &&
            isDefined(selectIndex) &&
            open &&
            images
              .slice(Math.max(0, selectIndex - 1), Math.min(selectIndex + 2, images.length + 1))
              .map((item, index) => {
                return (
                  <ImageModal
                    {...item}
                    key={item.id}
                    actionRef={actionRef}
                    selectIndex={selectIndex}
                    index={index}
                    destroy={destroy}
                    x={x}
                    y={y}
                  />
                );
              })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
