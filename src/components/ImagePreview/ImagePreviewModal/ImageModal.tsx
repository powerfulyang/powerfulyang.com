import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { memo, startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { Assets } from '@powerfulyang/components';
import styles from '@/components/ImagePreview/ImagePreviewModal/content.module.scss';
import type { ImagePreviewItem } from '@/components/ImagePreview';

type ImageModalProps = {
  selectIndex: number;
  index: number;
  actionRef: any;
  destroy: (index: number) => void;
  x: number;
  y: number;
} & ImagePreviewItem;

type Custom = {
  isPrev: boolean;
  isNext: boolean;
  x: number;
  y: number;
  loaded: boolean;
  animated: boolean;
  realIndex: number;
  selectIndex: number;
};

export const ImageModal = memo<ImageModalProps>(
  ({ selectIndex, index, actionRef, destroy, x, y, ...rest }) => {
    const [url, setUrl] = useState(() => {
      return rest.thumbnail || rest.original;
    });
    const [loaded, setLoaded] = useState(false);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
      const originUrl = rest.original;
      if (originUrl && animated) {
        const img = new Image();
        img.src = originUrl;
        img.onload = () => {
          startTransition(() => {
            setUrl(originUrl);
            setLoaded(true);
          });
        };
        img.onerror = () => {
          startTransition(() => {
            setUrl(Assets.brokenImg);
            setLoaded(true);
          });
        };
      }
    }, [rest.original, animated]);

    const realIndex = selectIndex === 0 ? selectIndex + index : selectIndex - 1 + index;
    const isPrev = selectIndex > realIndex;
    const isNext = selectIndex < realIndex;
    const isMain = selectIndex === realIndex;

    const isSmallScreen = useMemo(() => {
      return window.innerWidth < 768;
    }, []);

    const viewportWidth = useMemo(() => {
      return window.visualViewport?.width || window.innerWidth;
    }, []);

    const viewportHeight = useMemo(() => {
      return window.visualViewport?.height || window.innerHeight;
    }, []);

    const isWider = useMemo(() => {
      const width = isSmallScreen ? viewportWidth : viewportWidth - 70 * 2;
      return viewportHeight / width > Number(rest.size?.height) / Number(rest.size?.width);
    }, [isSmallScreen, viewportWidth, viewportHeight, rest.size?.height, rest.size?.width]);

    const variants = useMemo(
      () => ({
        initial: ({ realIndex: r, selectIndex: s }: Custom) => {
          return {
            opacity: 0.3,
            filter: 'blur(20px)',
            scale: 0.3,
            x: viewportWidth * (r - s),
          };
        },
        animate: ({
          isPrev: p,
          isNext: n,
          x: ox,
          loaded: l,
          animated: a,
          y: oy,
          realIndex: r,
          selectIndex: s,
        }: Custom) => {
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
            x: viewportWidth * (r - s) + Number(ox) + offset,
            opacity: 1,
            filter: l && a ? 'blur(0px)' : 'blur(5px)',
            scale: oy ? 1 - oy / viewportHeight : 1,
            y: oy,
            ...t,
          };
        },
        exit: ({ y: oy, selectIndex: s, realIndex: r }: Custom) => {
          return {
            x: viewportWidth * (r - s),
            opacity: 0,
            scale: oy ? 0.3 : 0.6,
          };
        },
      }),
      [actionRef, viewportHeight, viewportWidth],
    );

    const onAnimateComplete = useCallback(
      (label: string) => {
        if (isMain && label === 'exit') {
          destroy(selectIndex);
        }
        if (label === 'animate') {
          setAnimated(true);
        }
      },
      [destroy, isMain, selectIndex],
    );

    return (
      <motion.img
        custom={{
          isPrev,
          isNext,
          x,
          y,
          loaded,
          animated,
          realIndex,
          selectIndex,
        }}
        onAnimationComplete={onAnimateComplete}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className={classNames(styles.image, 'pointer', {
          [styles.wFullImage]: isWider,
          'h-full': !isWider,
        })}
        src={url}
        alt=""
        draggable={false}
        onClick={(e) => e.stopPropagation()}
      />
    );
  },
);

ImageModal.displayName = 'ImageModal';
