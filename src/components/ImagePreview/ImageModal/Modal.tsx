import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import styles from './modal.module.scss';

type ImageModalContentProps = {
  visible?: boolean;
};

export const ImageModalContent: FC<ImageModalContentProps> = ({ visible = false }) => {
  useEffect(() => {}, [visible]);
  return (
    <div
      className={classNames(styles.wrap, {
        hidden: !visible,
      })}
    >
      <img src="" alt="" />
    </div>
  );
};
