import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type CollapseProps = {
  collapsed: boolean;
};

export const Collapse: FC<PropsWithChildren<CollapseProps>> = ({ children, collapsed }) => {
  const ref = useRef(0);
  const divRef = useRef<HTMLDivElement>(null);
  const [renderClass, setRenderClass] = useState('');
  useEffect(() => {
    ref.current += 1;
  }, []);
  useEffect(() => {
    const div = divRef.current!;
    if (collapsed) {
      div.style.height = `0px`;
      setRenderClass('overflow-hidden');
    } else if (ref.current === 0) {
      // first render
      setRenderClass('h-auto overflow-visible visible');
    } else {
      div.style.height = `${div.scrollHeight}px`;
    }
  }, [collapsed]);
  return (
    <div ref={divRef} className={classNames(renderClass, styles.collapse)}>
      {children}
    </div>
  );
};
