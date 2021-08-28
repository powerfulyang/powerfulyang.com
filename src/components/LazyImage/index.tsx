import React, {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { CosUtils, getCosObjectThumbnailUrl } from '@/utils/lib';
import { useClientState } from '@/hooks/useClientState';
import { motion } from 'framer-motion';
import styles from './index.module.scss';

type LazyImageExtendProps = {
  inViewAction?: (id?: number) => void;
  assetId?: number;
};
const variants = {
  loading: {
    scale: 1.5,
    filter: 'blur(40px)',
  },
  loaded: {
    scale: 1,
    filter: 'blur(0px)',
  },
};

export const LazyImage: FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & LazyImageExtendProps
> = ({ src, className, alt, inViewAction, assetId, ...props }) => {
  const [loading, setLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver>();
  const ref = useRef<HTMLImageElement>(null);
  const [imgUrl, setImgUrl] = useState('/transparent.png');
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { target, intersectionRatio } = entry as unknown as {
          target: HTMLImageElement;
          intersectionRatio: number;
        };

        if (intersectionRatio > 0 && src) {
          const _target = new Image();
          const source = getCosObjectThumbnailUrl(src)!;
          inViewAction?.(assetId);
          _target.onload = () => {
            setLoading(false);
            setImgUrl(source);
          };
          _target.src = source;
          observerRef.current?.unobserve(target);
        }
      });
    });
  }, [assetId, inViewAction, src]);

  useEffect(() => {
    const observerRefCurrent = observerRef?.current!;
    observerRefCurrent.observe(ref.current!);
    return () => {
      observerRefCurrent.disconnect();
    };
  }, []);

  const bgUrl = useClientState(() => `url(${CosUtils.getCosObjectBlurUrl(src)})`);

  return (
    <div className={classNames(className, 'overflow-hidden rounded pointer')}>
      <motion.div
        variants={variants}
        initial="loading"
        animate={(!loading && 'loaded') || 'loading'}
        className="w-full h-full"
        transition={{ duration: 1.2 }}
      >
        <img
          {...props}
          className={classNames(
            {
              [styles.loading]: loading,
              [styles.loaded_img]: !loading,
            },
            'object-cover w-full h-full bg-no-repeat bg-cover',
          )}
          style={{ backgroundImage: bgUrl }}
          src={imgUrl}
          alt={alt}
          ref={ref}
        />
      </motion.div>
    </div>
  );
};
