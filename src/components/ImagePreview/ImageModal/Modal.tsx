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
      style={{
        backgroundImage: `url(${getCosObjectUrl(selectImage)})`,
      }}
    >
      <div className={styles.blur}>
        <img
          src={getCosObjectUrl(selectImage)}
          alt=""
          onClick={() => dispatch({ type: ImageModalContextActionType.close })}
        />
      </div>
    </div>
  );
};
