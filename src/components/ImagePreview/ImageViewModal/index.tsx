import type { FC } from 'react';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { useLockScroll, usePortal } from '@powerfulyang/hooks';
import { isDefined, scrollIntoView } from '@powerfulyang/utils';
import { ImageViewContent } from '@/components/ImagePreview/ImageViewModal/ImageViewContent';
import { ImagePreviewContext } from '@/context/ImagePreviewContext';
import { useHiddenHtmlOverflow } from '@/hooks/useHiddenHtmlOverflow';

type ImageModalProps = {
  parentNode?: HTMLElement;
};

const ImageViewModal: FC<ImageModalProps> = ({ parentNode }) => {
  const dialogNode = useRef<HTMLElement>(document.createElement('section'));
  const Portal = usePortal(dialogNode.current);
  const {
    state: { selectIndex, images },
  } = useContext(ImagePreviewContext);
  const showModal = useMemo(() => isDefined(selectIndex), [selectIndex]);
  useLockScroll(showModal);
  useHiddenHtmlOverflow(showModal);
  useEffect(() => {
    if (showModal) {
      const dialog = dialogNode.current;
      const parent = parentNode || document.body;
      parent.appendChild(dialog);
      return () => {
        parent.removeChild(dialog);
      };
    }
    return () => {};
  }, [parentNode, showModal]);

  useEffect(() => {
    if (isDefined(images) && isDefined(selectIndex)) {
      const { id } = images[selectIndex];
      scrollIntoView(document.getElementById(String(id)), {
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [images, selectIndex]);

  return (
    <Portal>
      <ImageViewContent />
    </Portal>
  );
};

export default ImageViewModal;
