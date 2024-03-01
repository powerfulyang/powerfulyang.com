import { ImageViewContent } from '@/components/ImagePreview/ImagePreviewModal/ImageViewContent';
import { ImagePreviewContext } from '@/context/ImagePreviewContext';
import { useHiddenOverflow } from '@/hooks/useHiddenOverflow';
import { useLockScroll } from '@powerfulyang/hooks';
import { isDefined, scrollIntoView } from '@powerfulyang/utils';
import { useIsomorphicLayoutEffect } from 'framer-motion';
import type { FC, PropsWithChildren } from 'react';
import { useContext } from 'react';
import { createPortal } from 'react-dom';

const Portal: FC<PropsWithChildren<any>> = (props) => {
  const { container = globalThis?.document?.body, children } = props;
  return container ? createPortal(children, container) : null;
};

type ImagePreviewModalProps = {};

const ImagePreviewModal: FC<ImagePreviewModalProps> = () => {
  const {
    state: { selectIndex },
    images,
  } = useContext(ImagePreviewContext);
  const showModal = isDefined(selectIndex);
  useLockScroll(showModal);
  useHiddenOverflow(showModal);

  useIsomorphicLayoutEffect(() => {
    if (isDefined(images) && isDefined(selectIndex)) {
      const { id } = images[selectIndex];
      if (id) {
        requestAnimationFrame(() => {
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
