import type { FC } from 'react';
import React from 'react';
import classNames from 'classnames';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { useHistory } from '@/hooks/useHistory';
import styles from './index.module.scss';

export const Link: FC<
  HTMLMotionProps<'a'> & {
    redirect?: boolean;
  }
> = ({ children, onClick, href, className, redirect = false, ...props }) => {
  const { pushState } = useHistory();

  return (
    <motion.a
      {...props}
      className={classNames(styles.link, className)}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (redirect) {
          // do nothing
        } else {
          e.preventDefault();
          href && pushState(href);
        }
      }}
    >
      {children}
    </motion.a>
  );
};
