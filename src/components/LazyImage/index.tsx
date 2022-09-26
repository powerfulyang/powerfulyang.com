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
    containerClassName,
    lazy = true,
    aspectRatio,
    initialInView = true,
    triggerOnce = true,
    ...props
  }) => {
    const [loading, setLoading] = useState(() => {
      const isLocalData = src?.startsWith('data:') || src?.startsWith('blob:');
      if (lazy) {
        // local data 不需要加载动画
        if (isLocalData) {
          return false;
        }
        // 加载过的图片且 triggerOnce 为 true 不需要加载动画
        return !(LOADED_IMAGE_URLS.has(src) && triggerOnce);
      }
      return false;
    });
    const [imgSrc, setImgSrc] = useState(() => {
      if (lazy && triggerOnce) {
        return (LOADED_IMAGE_URLS.has(src) ? src : blurSrc) || src || Assets.brokenImg;
      }
      if (lazy && !triggerOnce) {
        return blurSrc || src || Assets.brokenImg;
      }
      return src || blurSrc || Assets.brokenImg;
    });

    const { ref, inView } = useInView({
      rootMargin: '400px',
      initialInView,
      triggerOnce,
      onChange: (viewed) => {
        if (!viewed && !triggerOnce && blurSrc) {
          setLoading(true);
          setImgSrc(blurSrc);
        }
      },
    });

    const variants = useMemo<Variants>(() => {
      return {
        loading: {
          scale: 1.1,
          filter: 'blur(32px)',
        },
        loaded: {
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            duration: 0.2 + Math.random() * 0.2,
          },
        },
      };
    }, []);

    return (
      <span
        className={classNames(
          containerClassName,
          'isolate block w-full select-none overflow-hidden',
        )}
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
                style={{ ...props.style }}
                loading={loading ? 'lazy' : 'eager'}
                variants={variants}
                initial={loading ? 'loading' : 'loaded'}
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
