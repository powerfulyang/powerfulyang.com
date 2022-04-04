import type { FC } from 'react';
import React, { Children, cloneElement, useEffect, useMemo } from 'react';
import { useImmerReducer } from '@powerfulyang/hooks';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { ImageModalContextAction, ImageModalContextState } from '@/context/ImageModalContext';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';
import type { Asset } from '@/type/Asset';

const ImageViewModal = dynamic(() => import('@/components/ImagePreview/ImageViewModal'), {
  ssr: false,
});

const reducer = (draft: ImageModalContextState, action: ImageModalContextAction) => {
  switch (action.type) {
    case ImageModalContextActionType.close:
      draft.selectIndex = undefined;
      break;
    case ImageModalContextActionType.open:
      draft.selectIndex = action.payload?.selectIndex;
      break;
    case ImageModalContextActionType.updateImages:
      draft.images = action.payload?.images;
      break;
    default:
  }
};

export const ImagePreview: FC<{
  images: Asset[];
  parentControl?: boolean;
}> = ({ children, images, parentControl = true }) => {
  const [state, dispatch] = useImmerReducer<ImageModalContextState>(reducer, {});
  useEffect(() => {
    dispatch({
      type: ImageModalContextActionType.updateImages,
      payload: {
        images,
      },
    });
  }, [dispatch, images]);
  const memo = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <ImageModalContext.Provider value={memo}>
      <ImageViewModal />
      {(parentControl &&
        Children.map(children, (child, index) =>
          cloneElement(<motion.span>{child}</motion.span>, {
            onTap() {
              if (parentControl) {
                dispatch({
                  type: ImageModalContextActionType.open,
                  payload: {
                    selectIndex: index,
                  },
                });
              }
            },
          }),
        )) ||
        children}
    </ImageModalContext.Provider>
  );
};
