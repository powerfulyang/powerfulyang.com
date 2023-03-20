import type { FC } from 'react';
import React, { useContext, useEffect, useMemo } from 'react';
import { useLockScroll, usePortal } from '@powerfulyang/hooks';
import { isDefined, scrollIntoView } from '@powerfulyang/utils';
import { ImageViewContent } from '@/components/ImagePreview/ImagePreviewModal/ImageViewContent';
import { ImagePreviewContext } from '@/context/ImagePreviewContext';
import { useHiddenOverflow } from '@/hooks/useHiddenOverflow';

type ImagePreviewModalProps = {};

const ImagePreviewModal: FC<ImagePreviewModalProps> = () => {
  const Portal = usePortal();
  const {
    state: { selectIndex, images },
  } = useContext(ImagePreviewContext);
  const showModal = useMemo(() => isDefined(selectIndex), [selectIndex]);
  useLockScroll(showModal);
  useHiddenOverflow(showModal);

  useEffect(() => {
    if (isDefined(images) && isDefined(selectIndex)) {
      const { id } = images[selectIndex];
      if (id) {
        requestIdleCallback(() => {
          scrollIntoView(document.getElementById(id), {
            behavior: 'smooth',
            block: 'nearest',
          });
        });
      }
    }
  }, [images, selectIndex]);

  return <Portal>{showModal && <ImageViewContent />}</Portal>;
};

export default ImagePreviewModal;
