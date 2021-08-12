import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import { getCosObjectUrl } from '@/utils/lib';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';
import styles from './modal.module.scss';

type ImageModalContentProps = {};

export const ImageModalContent: FC<ImageModalContentProps> = () => {
  const {
    state: { selectImage, visible },
    dispatch,
  } = useContext(ImageModalContext);
  return (
    <div
      className={classNames(styles.wrap, {
        hidden: !visible,
      })}
    >
      <div className={styles.blur}>
        <img
          className={styles.image}
          src={getCosObjectUrl(selectImage)}
          alt=""
          onClick={() => dispatch({ type: ImageModalContextActionType.close })}
        />
      </div>
    </div>
  );
};
