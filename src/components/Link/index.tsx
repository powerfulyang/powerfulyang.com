import type { FC } from 'react';
import React from 'react';
import classNames from 'classnames';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { useHistory } from '@/hooks/useHistory';
import styles from './index.module.scss';

export const Link: FC<HTMLMotionProps<'a'>> = ({
  children,
  onClick,
  href,
  className,
  ...props
}) => {
  const { pushState } = useHistory();

  return (
    <motion.a
      {...props}
      className={classNames(styles.link, className)}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        e.preventDefault();
        return href && pushState(href);
      }}
    >
      {children}
    </motion.a>
  );
};
