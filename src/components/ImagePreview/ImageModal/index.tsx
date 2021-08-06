import { createPortal } from 'react-dom';
import React, { FC, useEffect, useRef, useState } from 'react';
import { ImageModalContent } from '@/components/ImagePreview/ImageModal/Modal';
import { isClient } from '@powerfulyang/utils';

type ImageModalProps = {
  parentNode?: HTMLElement;
  onClose?: VoidFunction;
  visible?: boolean;
};

export const ImageModal: FC<ImageModalProps> = ({ parentNode, visible }) => {
  const originalOverflowRef = React.useRef('');
  const dialogNode = useRef<HTMLElement>((isClient && document.createElement('section')) || null);
  useEffect(() => {
    const dialog = dialogNode.current;
    const parent = parentNode || document.body;
    parent.appendChild(dialog!);
    const { style } = parent;
    originalOverflowRef.current = style.overflow;
    style.overflow = 'hidden';

    return () => {
      style.overflow = originalOverflowRef.current;
      document.body.removeChild(dialog!);
    };
  }, [parentNode]);

  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return <>{show && createPortal(<ImageModalContent visible={visible} />, dialogNode.current!)}</>;
};
