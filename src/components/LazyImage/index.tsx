import React, { memo, useMemo, useState } from 'react';
import classNames from 'classnames';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { InView, useInView } from 'react-intersection-observer';
import type { Variants } from 'framer-motion/types/types';
import { Assets } from '@powerfulyang/components';
import styles from './index.module.scss';

export type LazyImageExtendProps = {
  blurSrc?: string;
  containerClassName?: string;
  /**
   * 是否需要加载动画
   */
  lazy?: boolean;
  aspectRatio?: string;
  initialInView?: boolean;
  triggerOnce?: boolean;
};

export type LazyImageProps = HTMLMotionProps<'img'> & LazyImageExtendProps;

export const LazyImage = memo<LazyImageProps>(
  ({
    src,
    className = 'object-cover w-full h-full',
    blurSrc,
    containerClassName,
    lazy = true,
    aspectRatio,
    initialInView = true,
    triggerOnce = true,
    ...props
  }) => {
    const [loading, setLoading] = useState(lazy);
    const [imgSrc, setImgSrc] = useState(() => {
      return lazy ? blurSrc : src;
    });

    const { ref, inView } = useInView({
      rootMargin: '400px',
      initialInView,
      triggerOnce,
    });

    const variants = useMemo<Variants>(() => {
      return {
        loading: {
          scale: 1.3,
          filter: 'blur(32px)',
        },
        loaded: {
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            duration: 0.5 + Math.random() * 0.5,
          },
        },
      };
    }, []);

    return (
      <span
        className={classNames(
          containerClassName,
          'pointer isolate block w-full select-none overflow-hidden',
        )}
        style={{ aspectRatio }}
        ref={ref}
      >
        {inView && (
          <InView
            delay={100}
            triggerOnce
            skip={!lazy}
            onChange={(viewed: boolean) => {
              if (viewed && src) {
                const img = new Image();
                img.onload = () => {
                  setImgSrc(src);
                  setLoading(false);
                };
                img.onerror = () => {
                  setImgSrc(Assets.brokenImg);
                  setLoading(false);
                };
                img.src = src;
              }
            }}
          >
            {({ ref: imgRef }) => (
              <motion.img
                {...props}
                ref={imgRef}
                style={{ ...props.style }}
                loading="lazy"
                variants={variants}
                initial={lazy ? 'loading' : 'loaded'}
                animate={!loading && 'loaded'}
                className={classNames(
                  {
                    [styles.loadedImg]: !loading,
                    [styles.loadingImg]: loading,
                  },
                  className,
                )}
                src={imgSrc}
              />
            )}
          </InView>
        )}
      </span>
    );
  },
);

LazyImage.displayName = 'LazyImage';
