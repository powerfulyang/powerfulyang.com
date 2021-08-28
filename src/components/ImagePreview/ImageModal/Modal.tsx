import React, { FC, useContext } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Icon } from '@powerfulyang/components';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';
import styles from './modal.module.scss';

type ImageModalContentProps = {};

export const ImageModalContent: FC<ImageModalContentProps> = () => {
  const {
    state: { images, selectIndex },
    dispatch,
  } = useContext(ImageModalContext);
  const closeModal = () => {
    dispatch({
      type: ImageModalContextActionType.close,
    });
  };
  return (
    <div className={classNames(styles.wrap)}>
      <Icon type="icon-arrow-left" className={styles.prev} />
      <Icon type="icon-arrow-right" className={styles.next} />
      <motion.div className={styles.blur}>
        <motion.img
          className={classNames(styles.image, 'pointer')}
          src={images?.[selectIndex!]?.objectUrl}
          onClick={closeModal}
        />
      </motion.div>
    </div>
  );
};
