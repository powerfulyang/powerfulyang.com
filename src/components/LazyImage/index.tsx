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
    scale: 1.4,
    filter: 'blur(20px)',
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
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { target, intersectionRatio } = entry;

        if (intersectionRatio > 0 && src) {
          const _target = target as HTMLImageElement;
          _target.src = getCosObjectThumbnailUrl(src)!;
          inViewAction?.(assetId);
          _target.onload = () => {
            setLoading(false);
          };
          _target.onerror = () => {
            _target.src = '/default.png';
          };
          observerRef.current?.unobserve(_target);
        }
      });
    });
  }, [assetId, inViewAction, src]);

  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observerRefCurrent = observerRef?.current!;
    observerRefCurrent.observe(ref.current!);
    return () => {
      observerRefCurrent.disconnect();
    };
  }, []);

  const bgUrl = useClientState(() => `url(${CosUtils.getCosObjectBlurUrl(src)})`);

  return (
    <div className={classNames(className, 'overflow-hidden', 'rounded')}>
      <motion.div
        variants={variants}
        initial="loading"
        animate={!loading && 'loaded'}
        className="w-full h-full"
        style={{ originX: 0.5, originY: 0.5 }}
        transition={{ duration: 1.2 }}
      >
        <img
          {...props}
          className={classNames(
            {
              [styles.loading]: loading,
              [styles.loaded_img]: !loading,
            },
            'object-cover w-full h-full',
          )}
          style={{ backgroundImage: bgUrl }}
          src="/transparent.png"
          alt={alt}
          ref={ref}
        />
      </motion.div>
    </div>
  );
};
