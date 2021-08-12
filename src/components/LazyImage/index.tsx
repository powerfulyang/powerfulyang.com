import React, {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { getCosObjectThumbnailUrl } from '@/utils/lib';
import styles from './index.module.scss';

type LazyImageExtendProps = {
  inViewAction?: (id?: number) => void;
  assetId?: number;
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
          _target.src = getCosObjectThumbnailUrl(src);
          _target.onload = () => {
            setLoading(false);
            inViewAction?.(assetId);
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

  return (
    <img
      {...props}
      className={classNames(className, {
        [styles.loading]: loading,
        [styles.loaded]: !loading,
      })}
      src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
      alt={alt}
      ref={ref}
    />
  );
};
