import type { FC } from 'react';
import React, { Children, cloneElement, useEffect, useMemo } from 'react';
import { useImmerReducer } from '@powerfulyang/hooks';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import type {
  ImageModalContextAction,
  ImagePreviewContextState,
} from '@/context/ImagePreviewContext';
import { ImagePreviewContext, ImagePreviewContextActionType } from '@/context/ImagePreviewContext';
import type { Asset } from '@/type/Asset';

const ImageViewModal = dynamic(() => import('@/components/ImagePreview/ImageViewModal'), {
  ssr: false,
});

const reducer = (draft: ImagePreviewContextState, action: ImageModalContextAction) => {
  switch (action.type) {
    case ImagePreviewContextActionType.close:
      draft.selectIndex = undefined;
      break;
    case ImagePreviewContextActionType.open:
      draft.selectIndex = action.payload?.selectIndex;
      break;
    case ImagePreviewContextActionType.updateImages:
      draft.images = action.payload?.images;
      break;
    default:
  }
};

export const ImagePreview: FC<{
  images: Asset[];
  parentControl?: boolean;
}> = ({ children, images, parentControl = true }) => {
  const [state, dispatch] = useImmerReducer<ImagePreviewContextState>(reducer, {});
  useEffect(() => {
    dispatch({
      type: ImagePreviewContextActionType.updateImages,
      payload: {
        images,
      },
    });
  }, [dispatch, images]);
  const memo = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <ImagePreviewContext.Provider value={memo}>
      <ImageViewModal />
      {(parentControl &&
        Children.map(children, (child, index) =>
          cloneElement(<motion.span>{child}</motion.span>, {
            onTap() {
              dispatch({
                type: ImagePreviewContextActionType.open,
                payload: {
                  selectIndex: index,
                },
              });
            },
          }),
        )) ||
        children}
    </ImagePreviewContext.Provider>
  );
};
