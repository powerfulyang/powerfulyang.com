'use client';

import { Assets } from '@powerfulyang/components';
import classNames from 'classnames';
import type { HTMLMotionProps, Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import React, { useMemo, useState } from 'react';
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

const { brokenImg } = Assets;

export const LazyImage: FC<LazyImageProps> = (
  {
    src,
    className = 'object-cover w-full h-full',
    blurSrc,
    containerClassName = 'w-full',
    lazy = true,
    aspectRatio,
    ...props
  },
) => {
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
    onChange: (inView) => {
      if (inView) {
        if (loading) {
          setImgSrc(src || brokenImg);
          setLoading(false);
        }
        LOADED_IMAGE_URLS.add(src);
      }
    },
  });

  return (
    <span
      className={classNames(containerClassName, 'isolate block select-none overflow-hidden')}
      style={{ aspectRatio }}
    >
      <motion.img
        {...props}
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
