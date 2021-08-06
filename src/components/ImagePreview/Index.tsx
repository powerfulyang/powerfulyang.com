import React, { Children, cloneElement, FC, ReactElement, useState } from 'react';
import { ImageModal } from '@/components/ImagePreview/ImageModal';

export const ImagePreview: FC = ({ children }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ImageModal onClose={() => setVisible(false)} visible={visible} />
      {Children.map(children, (child) => {
        return cloneElement(child as ReactElement, {
          onClick: () => setVisible(true),
        });
      })}
    </>
  );
};
