import React, { memo, useMemo, useState } from 'react';
import classNames from 'classnames';
import type { HTMLMotionProps, Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { InView, useInView } from 'react-intersection-observer';
import { Assets } from '@powerfulyang/components';
import styles from './index.module.scss';

export type LazyImageExtendProps = {
  blurSrc?: string;
  containerClassName?: string;
  /**
   * 是否需要加载动画
   */
  lazy?: boolean;
  aspectRatio?: `${number} / ${number}`;
  initialInView?: boolean;
  triggerOnce?: boolean;
};

export type LazyImageProps = HTMLMotionProps<'img'> & LazyImageExtendProps;

export const LOADED_IMAGE_URLS = new Set<string | undefined>();

export const LazyImage = memo<LazyImageProps>(
  ({
    src,
    className = 'object-cover w-full h-full',
    blurSrc,
    containerClassName = 'w-full',
    lazy = true,
    aspectRatio,
    initialInView = false,
    triggerOnce = true,
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
        return (LOADED_IMAGE_URLS.has(src) ? src : blurSrc) || src || Assets.brokenImg;
      }
      return src || blurSrc || Assets.brokenImg;
    });

    const { ref, inView } = useInView({
      initialInView,
      triggerOnce,
      skip: triggerOnce && initialInView,
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

    return (
      <span
        className={classNames(containerClassName, 'isolate block select-none overflow-hidden')}
        style={{ aspectRatio }}
        ref={ref}
      >
        {inView && (
          <InView
            triggerOnce
            skip={!loading}
            onChange={(viewed: boolean) => {
              if (viewed && src) {
                const img = new Image();
                img.decoding = 'async';
                if (props.crossOrigin) {
                  img.crossOrigin = props.crossOrigin;
                }
                img.onload = () => {
                  LOADED_IMAGE_URLS.add(src);
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
                style={props.style}
                variants={variants}
                initial={loading ? 'loading' : 'loaded'}
                animate={!loading && 'loaded'}
                className={classNames(className, {
                  [styles.loading]: loading,
                })}
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
