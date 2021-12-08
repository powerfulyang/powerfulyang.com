import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { assets } from '@powerfulyang/components';
import styles from './index.module.scss';

type LazyImageExtendProps = {
  inViewAction?: (id?: number) => void;
  assetId?: number;
  blurSrc?: string;
  imageClassName?: string;
};
const variants = {
  loading: {
    scale: 1.3,
    filter: 'blur(32px)',
  },
  loaded: {
    scale: 1,
    filter: 'blur(0px)',
  },
};

export const LazyImage: FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & LazyImageExtendProps
> = ({
  src,
  className,
  alt,
  inViewAction,
  assetId,
  blurSrc,
  imageClassName = 'object-cover w-full h-full',
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLImageElement>(null);
  const [imgUrl, setImgUrl] = useState(blurSrc);
  useEffect(() => {
    if (src) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const { target, intersectionRatio } = entry;

          if (intersectionRatio > 0) {
            const img = new Image();
            const source = src;
            inViewAction?.(assetId);
            img.onload = () => {
              setLoading(false);
              setImgUrl(source);
            };
            img.onerror = () => {
              setLoading(false);
              setImgUrl(assets.brokenImg);
            };
            img.src = source;
            observer.unobserve(target);
          }
        });
      });
      observer.observe(ref.current!);
      return () => {
        observer.disconnect();
      };
    }
    return () => {};
  }, [assetId, inViewAction, src]);

  return (
    <div className={classNames(className, 'overflow-hidden cursor-pointer')}>
      <motion.div
        variants={variants}
        initial="loading"
        animate={(!loading && 'loaded') || 'loading'}
        transition={{ duration: 0.88 }}
        className="w-full h-full"
      >
        <img
          {...props}
          className={classNames(
            {
              [styles.loadedImg]: !loading,
            },
            imageClassName,
          )}
          src={imgUrl}
          alt={alt}
          ref={ref}
        />
      </motion.div>
    </div>
  );
};
