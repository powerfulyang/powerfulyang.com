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
  containerClassName?: string;
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
> = ({ src, className, alt, inViewAction, assetId, blurSrc, containerClassName, ...props }) => {
  const [loading, setLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState('/transparent.png');
  useEffect(() => {
    if (blurSrc) {
      const image = new Image();
      image.src = blurSrc;
      image.onload = () => {
        setImgUrl((prevState) => {
          if (prevState === '/transparent.png') {
            return blurSrc;
          }
          return prevState;
        });
      };
    }
  }, [blurSrc]);
  const ref = useRef<HTMLImageElement>(null);
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
    <div className={classNames(containerClassName, 'overflow-hidden pointer')}>
      <motion.div
        variants={variants}
        initial="loading"
        animate={!loading && 'loaded'}
        transition={{ duration: 0.88 }}
        className="w-full h-full"
      >
        <img
          {...props}
          className={classNames(
            {
              [styles.loadedImg]: !loading,
            },
            className,
            styles.loadingImg,
            'w-full h-full object-cover',
          )}
          src={imgUrl}
          alt={alt}
          ref={ref}
        />
      </motion.div>
    </div>
  );
};
