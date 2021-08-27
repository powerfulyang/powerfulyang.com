import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { CosUtils, getCosObjectThumbnailUrl } from '@/utils/lib';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';
import { motion, Variants } from 'framer-motion';
import { ArrowLeft, ArrowRight } from '@powerfulyang/components';
import styles from './modal.module.scss';

type ImageModalContentProps = {};

const variants: Variants = {
  loading: {
    scale: 0.2,
    filter: 'blur(20px)',
  },
  loaded: {
    scale: 1,
    filter: 'blur(5px)',
  },
  completed: {
    scale: 1,
    filter: 'blur(0px)',
  },
};

export const ImageModalContent: FC<ImageModalContentProps> = () => {
  const {
    state: { selectImage, visible, origin, linkImages, images },
    dispatch,
  } = useContext(ImageModalContext);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = new Image();
    const src = CosUtils.getCosObjectUrl(selectImage)!;
    image.onload = () => {
      setLoading(false);
    };
    image.src = src;
  }, [selectImage]);

  const handlePrev = () => {
    dispatch({
      type: ImageModalContextActionType.open,
      payload: {
        selectImage: images![linkImages![0]].objectUrl,
        linkImages: [linkImages![0] - 1, linkImages![0] + 1],
      },
    });
  };
  return (
    <div
      className={classNames(styles.wrap, {
        hidden: !visible,
      })}
    >
      <ArrowLeft className={styles.prev} onClick={handlePrev} />
      <ArrowRight className={styles.next} />
      <motion.div
        className={styles.blur}
        variants={{
          blur: {
            backdropFilter: 'blur(20px)',
          },
          start: {
            backdropFilter: 'blur(10px)',
          },
        }}
        animate={(!loading && 'blur') || 'start'}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          variants={variants}
          animate={!loading ? 'completed' : 'loaded'}
          ref={ref}
          initial="loading"
          onAnimationComplete={(v) => {
            if (v === 'completed' && ref.current) {
              ref.current.src = CosUtils.getCosObjectUrl(selectImage)!;
            }
          }}
          style={{ originX: `${origin?.[0]}px`, originY: `${origin?.[1]}px` }}
          transition={{ duration: 0.8 }}
          className={styles.image}
          src={getCosObjectThumbnailUrl(selectImage)}
          alt=""
          onClick={() => dispatch({ type: ImageModalContextActionType.close })}
        />
      </motion.div>
    </div>
  );
};
