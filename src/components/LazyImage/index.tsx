'use client';

import { brokenImg } from '@/assets';
import classNames from 'classnames';
import type { HTMLMotionProps, Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './index.module.scss';

export type LazyImageExtendProps = {
  blurSrc?: string;
  containerClassName?: string;
  /**
   * 是否需要加载动画
   */
  lazy?: boolean;
  aspectRatio?: `${number} / ${number}`;
};

export type LazyImageProps = HTMLMotionProps<'img'> & LazyImageExtendProps;

export const LOADED_IMAGE_URLS = new Set<string | undefined>();

export const LazyImage: FC<LazyImageProps> = ({
  src,
  className = 'object-cover w-full h-full',
  blurSrc,
  containerClassName = 'w-full',
  lazy = true,
  aspectRatio,
  ...props
}) => {
  const [loading, setLoading] = useState(() => {
    const isLocalDataOrEmpty = src?.startsWith('data:') || src?.startsWith('blob:') || !src;
    if (lazy) {
      // local data 不需要加载动画
      if (isLocalDataOrEmpty) {
        return false;
      }
      // 加载过的图片不需要加载动画
      return !LOADED_IMAGE_URLS.has(src);
    }
    return false;
  });

  const [imgSrc, setImgSrc] = useState(() => {
    if (lazy) {
      return (LOADED_IMAGE_URLS.has(src) ? src : blurSrc) || src || brokenImg;
    }
    return src || blurSrc || brokenImg;
  });

  const variants = useMemo<Variants>(() => {
    return {
      loading: {
        filter: 'blur(32px)',
        willChange: 'filter',
      },
      loaded: {
        filter: 'blur(0px)',
        transitionEnd: {
          willChange: 'auto',
        },
      },
    };
  }, []);

  const { ref } = useInView({
    triggerOnce: true,
    skip: !loading,
    onChange: (inView) => {
      if (inView && src) {
        const img = new Image();
        img.decoding = 'async';
        if (props.crossOrigin) {
          img.crossOrigin = props.crossOrigin;
        }
        img.src = src;
        img
          .decode()
          .then(() => {
            LOADED_IMAGE_URLS.add(src);
            setImgSrc(src);
            setLoading(false);
          })
          .catch(() => {
            setImgSrc(brokenImg);
            setLoading(false);
          });
      }
    },
  });

  return (
    <span
      className={classNames(containerClassName, 'block select-none overflow-hidden')}
      style={{ aspectRatio }}
    >
      <motion.img
        {...props}
        loading="lazy"
        ref={ref}
        variants={variants}
        initial={loading ? 'loading' : 'loaded'}
        animate={!loading && 'loaded'}
        className={classNames(className, {
          [styles.loading]: loading,
        })}
        src={imgSrc}
      />
    </span>
  );
};

LazyImage.displayName = 'LazyImage';
