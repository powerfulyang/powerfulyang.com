import React, { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

type CollapseProps = {
  collapsed: boolean;
};

export const Collapse: FC<CollapseProps> = ({ children, collapsed }) => {
  const ref = useRef(0);
  const divRef = useRef<HTMLDivElement>(null);
  const [renderClass, setRenderClass] = useState('');
  useEffect(() => {
    ref.current++;
  }, []);
  useEffect(() => {
    const div = divRef.current!;
    if (collapsed) {
      if (ref.current === 0) {
        // first render
        setRenderClass('h-auto overflow-visible visible');
      } else {
        div.style.height = `${div.scrollHeight}px`;
      }
    } else {
      div.style.height = `0px`;
      setRenderClass('overflow-hidden');
    }
  }, [collapsed]);
  return (
    <div ref={divRef} className={classNames(renderClass, styles.collapse)}>
      {children}
    </div>
  );
};
