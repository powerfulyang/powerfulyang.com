import type { FC } from 'react';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { usePortal } from '@powerfulyang/hooks';
import { isDefined } from '@powerfulyang/utils';
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
  const showModal = useMemo(() => isDefined(selectIndex), [selectIndex]);
  useEffect(() => {
    if (showModal) {
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
  }, [parentNode, showModal]);

  return (
    <Portal>
      <ImageModalContent />
    </Portal>
  );
};

export default ImageModal;
