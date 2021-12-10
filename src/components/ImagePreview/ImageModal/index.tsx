import type { FC } from 'react';
import React, { useContext, useEffect, useRef } from 'react';
import { usePortal } from '@powerfulyang/hooks';
import { ImageModalContent } from '@/components/ImagePreview/ImageModal/Modal';
import { ImageModalContext } from '@/context/ImageModalContext';

type ImageModalProps = {
  parentNode?: HTMLElement;
};

const ImageModal: FC<ImageModalProps> = ({ parentNode }) => {
  const dialogNode = useRef<HTMLElement>(document.createElement('section'));
  const { Portal } = usePortal({ container: dialogNode.current });
  const {
    state: { selectIndex },
  } = useContext(ImageModalContext);
  useEffect(() => {
    if (selectIndex !== undefined) {
      const dialog = dialogNode.current;
      const parent = parentNode || document.body;
      parent.appendChild(dialog);
      const { style } = parent;
      const originalOverflowRef = style.overflow;
      style.overflow = 'hidden';
      return () => {
        style.overflow = originalOverflowRef;
        parent.removeChild(dialog);
      };
    }
    return () => {};
  }, [parentNode, selectIndex]);

  return (
    <Portal>
      <ImageModalContent />
    </Portal>
  );
};

export default ImageModal;
