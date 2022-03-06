import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import type { MotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { assets } from '@powerfulyang/components';
import { useMountedRef } from '@powerfulyang/hooks';
import styles from './index.module.scss';

export type LazyImageExtendProps = {
  inViewAction?: (id?: number) => void;
  assetId?: number;
  blurSrc?: string;
  containerClassName?: string;
  /**
   * 是否需要加载动画
   */
  blur?: boolean;
};

export const LazyImage: FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> &
    LazyImageExtendProps &
    MotionProps
> = ({
  src,
  className = 'object-cover w-full',
  alt,
  inViewAction,
  assetId,
  blurSrc,
  containerClassName,
  blur = true,
  ...props
}) => {
  const [loading, setLoading] = useState(() => {
    return !!blur;
  });
  const [imgUrl, setImgUrl] = useState(() => {
    if (blur) {
      return assets.transparentImg;
    }
    return src;
  });
  const isMount = useMountedRef();
  useEffect(() => {
    if (blurSrc && blur) {
      const image = new Image();
      image.src = blurSrc;
      image.onload = () => {
        if (isMount.current) {
          setImgUrl((prevState) => {
            if (prevState === assets.transparentImg) {
              return blurSrc;
            }
            return prevState;
          });
        }
      };
    }
  }, [blur, blurSrc, isMount]);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (src && ref.current && blur) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const { target, intersectionRatio } = entry;

          if (intersectionRatio > 0) {
            const img = new Image();
            const source = src;
            inViewAction?.(assetId);
            img.onload = () => {
              if (isMount.current) {
                setImgUrl(source);
                setLoading(false);
              }
            };
            img.onerror = () => {
              if (isMount.current) {
                setLoading(false);
                setImgUrl(assets.brokenImg);
              }
            };
            img.src = source;
            observer.unobserve(target);
          }
        });
      });
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
    return () => {};
  }, [assetId, blur, inViewAction, isMount, src]);

  return (
    <span
      className={classNames(
        containerClassName,
        'overflow-hidden block pointer select-none isolate',
      )}
    >
      <motion.img
        {...props}
        draggable={false}
        variants={{
          loading: {
            scale: 1.3,
            filter: 'blur(32px)',
            willChange: 'filter, scale',
          },
          loaded: {
            scale: 1,
            filter: 'blur(0px)',
            transition: {
              duration: 0.77,
            },
            willChange: 'scroll-position',
          },
        }}
        initial={blur ? 'loading' : 'loaded'}
        animate={!loading && 'loaded'}
        className={classNames(
          {
            [styles.loadedImg]: !loading,
            [styles.loadingImg]: loading,
          },
          className,
        )}
        src={imgUrl}
        alt={alt}
        ref={ref}
      />
    </span>
  );
};
