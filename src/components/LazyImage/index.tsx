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
    <img
      {...props}
      className={classNames(className, {
        [styles.loading]: loading,
        [styles.loaded_img]: !loading,
      })}
      style={{ backgroundImage: bgUrl }}
      src="/transparent.png"
      alt={alt}
      ref={ref}
    />
  );
};
