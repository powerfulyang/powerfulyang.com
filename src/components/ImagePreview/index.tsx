import React, { Children, cloneElement, FC, useEffect } from 'react';
import { useImmerReducer } from '@powerfulyang/hooks';
import dynamic from 'next/dynamic';
import {
  ImageModalContext,
  ImageModalContextAction,
  ImageModalContextActionType,
  ImageModalContextState,
} from '@/context/ImageModalContext';
import { Asset } from '@/types/Asset';

const DynamicImageModal = dynamic(() => import('@/components/ImagePreview/ImageModal'), {
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

export const ImagePreview: FC<{ images: Asset[] }> = ({ children, images }) => {
  const [state, dispatch] = useImmerReducer(reducer, {});
  useEffect(() => {
    dispatch({
      type: ImageModalContextActionType.updateImages,
      payload: {
        images,
      },
    });
  }, [dispatch, images]);
  return (
    <>
      <ImageModalContext.Provider value={{ state, dispatch }}>
        <DynamicImageModal />
        {Children.map(children as any, (child, index) => {
          return cloneElement(child, {
            onClick() {
              dispatch({
                type: ImageModalContextActionType.open,
                payload: {
                  selectIndex: index,
                },
              });
            },
          });
        })}
      </ImageModalContext.Provider>
    </>
  );
};
