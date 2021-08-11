import React, {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

export const LazyImage: FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = ({ src, className, alt, ...props }) => {
  const [loading, setLoading] = useState(true);
  const srcRef = useRef(src);
  const observerRef = useRef<IntersectionObserver>();
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { target, intersectionRatio } = entry;

        if (intersectionRatio > 0) {
          const _target = target as HTMLImageElement;
          _target.src = srcRef.current ?? '';
          _target.onload = () => {
            setLoading(false);
          };
          observerRef.current?.unobserve(_target);
        }
      });
    });
  }, []);

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
