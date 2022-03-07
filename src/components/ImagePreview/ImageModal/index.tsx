import type { FC } from 'react';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { usePortal } from '@powerfulyang/hooks';
import { isDefined, scrollIntoView } from '@powerfulyang/utils';
import { fromEvent } from 'rxjs';
import { ImageModalContent } from '@/components/ImagePreview/ImageModal/Modal';
import { ImageModalContext } from '@/context/ImageModalContext';

type ImageModalProps = {
  parentNode?: HTMLElement;
};

const ImageModal: FC<ImageModalProps> = ({ parentNode }) => {
  const dialogNode = useRef<HTMLElement>(document.createElement('section'));
  const { Portal } = usePortal({ container: dialogNode.current });
  const {
    state: { selectIndex, images },
  } = useContext(ImageModalContext);
  const showModal = useMemo(() => isDefined(selectIndex), [selectIndex]);
  useEffect(() => {
    if (showModal) {
      const dialog = dialogNode.current;
      const parent = parentNode || document.body;
      parent.appendChild(dialog);
      const subscribe = fromEvent(document.body, 'touchmove', { passive: false }).subscribe((e) => {
        e.preventDefault(); // 阻止移动端乱七八糟的滚动效果
      });
      const subscribe2 = fromEvent(document.body, 'wheel', { passive: false }).subscribe((e) => {
        e.preventDefault(); // 阻止滚动条
      });
      return () => {
        parent.removeChild(dialog);
        subscribe.unsubscribe();
        subscribe2.unsubscribe();
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
      <ImageModalContent />
    </Portal>
  );
};

export default ImageModal;
