import type { FC, PropsWithChildren } from 'react';
import React, { Children, cloneElement, useEffect, useMemo } from 'react';
import { useImmerReducer } from '@powerfulyang/hooks';
import { motion } from 'framer-motion';
import type {
  ImageModalContextAction,
  ImagePreviewContextState,
} from '@/context/ImagePreviewContext';
import { ImagePreviewContext, ImagePreviewContextActionType } from '@/context/ImagePreviewContext';
import type { Asset } from '@/type/Asset';
import ImageViewModal from '@/components/ImagePreview/ImageViewModal';

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

export const ImagePreview: FC<
  PropsWithChildren<{
    images: Asset[];
    parentControl?: boolean;
  }>
> = ({ children, images, parentControl = true }) => {
  const [state, dispatch] = useImmerReducer<ImagePreviewContextState, ImageModalContextAction>(
    reducer,
    {},
  );
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
