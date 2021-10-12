import classNames from 'classnames';
import React, { FC } from 'react';
import styles from '../../index.module.scss';

type Props = {
  categoryItems: string[];
  categoryName: string;
};
export const Category: FC<Props> = ({ categoryName, categoryItems }) => {
  return (
    <div className={styles['side-wrapper']}>
      <div className={styles['side-title']}>{categoryName}</div>
      {categoryItems.map((x) => x)}
      <div className={styles['side-menu']}>
        <a href="#">
          <svg viewBox="0 0 512 512">
            <g xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path
                d="M0 0h128v128H0zm0 0M192 0h128v128H192zm0 0M384 0h128v128H384zm0 0M0 192h128v128H0zm0 0"
                data-original="#bfc9d1"
              />
            </g>
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M192 192h128v128H192zm0 0"
              fill="currentColor"
              data-original="#82b1ff"
            />
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M384 192h128v128H384zm0 0M0 384h128v128H0zm0 0M192 384h128v128H192zm0 0M384 384h128v128H384zm0 0"
              fill="currentColor"
              data-original="#bfc9d1"
            />
          </svg>
          All Apps
        </a>
        <a href="#">
          <svg viewBox="0 0 488.932 488.932" fill="currentColor">
            <path d="M243.158 61.361v-57.6c0-3.2 4-4.9 6.7-2.9l118.4 87c2 1.5 2 4.4 0 5.9l-118.4 87c-2.7 2-6.7.2-6.7-2.9v-57.5c-87.8 1.4-158.1 76-152.1 165.4 5.1 76.8 67.7 139.1 144.5 144 81.4 5.2 150.6-53 163-129.9 2.3-14.3 14.7-24.7 29.2-24.7 17.9 0 31.8 15.9 29 33.5-17.4 109.7-118.5 192-235.7 178.9-98-11-176.7-89.4-187.8-187.4-14.7-128.2 84.9-237.4 209.9-238.8z" />
          </svg>
          Updates
          <span className={classNames(styles['notification-number'], styles.updates)}>3</span>
        </a>
      </div>
    </div>
  );
};
