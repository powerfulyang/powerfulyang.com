import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';
import classNames from 'classnames';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import styles from './index.module.scss';

export type MenuProps = {
  overlay: ReactNode;
  className?: string;
};

export const Menu: FC<PropsWithChildren<MenuProps>> = ({ children, className, overlay }) => {
  const id = useId();
  const ref = useRef(null);
  const [popup, setPopup] = useState(false);
  useOutsideClick(ref, () => setPopup(false));

  return (
    <div ref={ref} className={classNames('relative')}>
      <button
        id={id}
        onClick={() => setPopup(!popup)}
        aria-expanded="true"
        aria-haspopup="true"
        type="button"
      >
        {children}
      </button>
      <div
        className={classNames(
          'common-shadow absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white',
          className,
          styles.animate,
          { [styles.enter]: popup, [styles.leave]: !popup },
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={id}
      >
        {overlay}
      </div>
    </div>
  );
};
