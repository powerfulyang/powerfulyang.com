import classNames from 'classnames';
import type { TargetAndTransition, Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  viewportWidth: number;
  viewportHeight: number;
  actionRef: any;
};

const variants: Variants = {
  initial: ({ realIndex: r, selectIndex: s, viewportWidth }: Custom) => {
    return {
      opacity: 0.3,
      filter: 'blur(5px)',
      scale: 0.3,
      x: viewportWidth * (r - s),
      willChange: 'transform, opacity',
    };
  },
  animate: ({
    isPrev: p,
    isNext: n,
    x: ox,
    loaded: l,
    y: oy,
    realIndex: r,
    selectIndex: s,
    actionRef,
    viewportWidth,
    viewportHeight,
  }: Custom) => {
    const offset: number = (p && -20) || (n && 20) || 0;
    let t: TargetAndTransition;
    if (actionRef.current !== 0) {
      t = {
        transition: {
          type: false,
        },
      };
    } else if (l) {
      t = {
        transitionEnd: {
          willChange: 'auto',
        },
      };
    } else {
      t = {
        willChange: 'filter',
        transition: {
          scale: {
            type: 'spring',
            stiffness: 500,
            damping: 30,
          },
        },
      };
    }

    return {
      x: viewportWidth * (r - s) + Number(ox) + offset,
      opacity: 1,
      filter: l ? 'blur(0px)' : 'blur(5px)',
      scale: oy ? 1 - oy / viewportHeight : 1,
      y: oy,
      ...t,
    };
  },
  exit: ({ y: oy, selectIndex: s, realIndex: r, viewportWidth }: Custom) => {
    return {
      x: viewportWidth * (r - s),
      opacity: 0,
      scale: oy ? 0.3 : 0.6,
    };
  },
};

export const ImageModal = memo<ImageModalProps>(
  ({ selectIndex, index, actionRef, destroy, x, y, ...rest }) => {
    const [url, setUrl] = useState(() => {
      return rest.thumbnail || rest.original;
    });
    const [loaded, setLoaded] = useState(false);
    const isBrokenRef = useRef<boolean>();

    useEffect(() => {
      const originUrl = rest.original;
      if (originUrl) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          setLoaded(true);
          isBrokenRef.current = false;
        };
        img.onerror = () => {
          setLoaded(true);
          isBrokenRef.current = true;
        };
        img.src = originUrl;
      }
    }, [rest.original]);

    const realIndex = selectIndex === 0 ? selectIndex + index : selectIndex - 1 + index;
    const isPrev = selectIndex > realIndex;
    const isNext = selectIndex < realIndex;
    const isMain = selectIndex === realIndex;

    const isSmallScreen = window.innerWidth < 768;

    const viewportWidth = window.visualViewport?.width || window.innerWidth;

    const viewportHeight = window.visualViewport?.height || window.innerHeight;

    const isWider = useMemo(() => {
      const width = isSmallScreen ? viewportWidth : viewportWidth - 70 * 2;
      return viewportHeight / width > Number(rest.size?.height) / Number(rest.size?.width);
    }, [isSmallScreen, viewportWidth, viewportHeight, rest.size?.height, rest.size?.width]);

    const onAnimateComplete = useCallback(
      (label: string) => {
        if (isMain && label === 'exit') {
          destroy(selectIndex);
        }
        if (label === 'animate' && loaded) {
          if (isBrokenRef.current === true) {
            setUrl(Assets.brokenImg);
          }
          if (isBrokenRef.current === false) {
            setUrl(rest.original);
          }
        }
      },
      [destroy, isMain, loaded, rest.original, selectIndex],
    );

    return (
      <motion.img
        custom={{
          isPrev,
          isNext,
          x,
          y,
          loaded,
          realIndex,
          selectIndex,
          viewportWidth,
          viewportHeight,
          actionRef,
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
