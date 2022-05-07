import React, { memo, useMemo, useState } from 'react';
import classNames from 'classnames';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { Assets } from '@powerfulyang/components';
import { useInView } from 'react-intersection-observer';
import type { Variants } from 'framer-motion/types/types';
import styles from './index.module.scss';

export type LazyImageExtendProps = {
  blurSrc?: string;
  containerClassName?: string;
  /**
   * 是否需要加载动画
   */
  lazy?: boolean;
};

export type LazyImageProps = HTMLMotionProps<'img'> & LazyImageExtendProps;

export const LazyImage = memo<LazyImageProps>(
  ({
    src,
    className = 'object-cover w-full',
    blurSrc,
    containerClassName,
    lazy = true,
    draggable = false,
    ...props
  }) => {
    const [loading, setLoading] = useState(lazy);
    const [imgSrc, setImgSrc] = useState(() => {
      return lazy ? blurSrc : src;
    });

    const { ref } = useInView({
      triggerOnce: true,
      skip: !lazy,
      onChange: (viewed: boolean) => {
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
      },
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
            duration: 0.66,
          },
        },
      };
    }, []);

    return (
      <span
        className={classNames(
          containerClassName,
          'pointer isolate block select-none overflow-hidden',
        )}
      >
        <motion.img
          {...props}
          ref={ref}
          draggable={draggable}
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
      </span>
    );
  },
);

LazyImage.displayName = 'LazyImage';
