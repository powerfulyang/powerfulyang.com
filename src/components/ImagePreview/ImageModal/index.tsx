import { createPortal } from 'react-dom';
import React, { FC, useContext, useEffect, useRef } from 'react';
import { ImageModalContent } from '@/components/ImagePreview/ImageModal/Modal';
import { isClient } from '@powerfulyang/utils';
import { ImageModalContext } from '@/context/ImageModalContext';

type ImageModalProps = {
  parentNode?: HTMLElement;
};

const ImageModal: FC<ImageModalProps> = ({ parentNode }) => {
  const dialogNode = useRef<HTMLElement>((isClient && document.createElement('section')) || null);
  const {
    state: { selectIndex },
  } = useContext(ImageModalContext);
  useEffect(() => {
    if (selectIndex !== undefined) {
      const dialog = dialogNode.current;
      const parent = parentNode || document.body;
      parent.appendChild(dialog!);
      const { style } = parent;
      const originalOverflowRef = style.overflow;
      style.overflow = 'hidden';
      return () => {
        style.overflow = originalOverflowRef;
        document.body.removeChild(dialog!);
      };
    }
    return () => {};
  }, [parentNode, selectIndex]);

  return <>{createPortal(<ImageModalContent />, dialogNode.current!)}</>;
};

export default ImageModal;
