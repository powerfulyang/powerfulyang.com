import React, { Children, cloneElement, FC, MouseEvent, ReactElement, useEffect } from 'react';
import { ImageModal } from '@/components/ImagePreview/ImageModal';
import {
  ImageModalContext,
  ImageModalContextAction,
  ImageModalContextActionType,
  ImageModalContextState,
} from '@/context/ImageModalContext';
import { useImmerReducer } from '@powerfulyang/hooks';
import { Asset } from '@/types/Asset';

const reducer = (draft: ImageModalContextState, action: ImageModalContextAction) => {
  switch (action.type) {
    case ImageModalContextActionType.close:
      draft.visible = false;
      break;
    case ImageModalContextActionType.open:
      draft.visible = true;
      draft.selectImage = action.payload?.selectImage;
      draft.origin = action.payload?.origin;
      draft.linkImages = action.payload?.linkImages;
      break;
    case ImageModalContextActionType.updateImages:
      draft.images = action.payload?.images;
      break;
    default:
  }
};

export const ImagePreview: FC<{ images: Asset[] }> = ({ children, images }) => {
  const [state, dispatch] = useImmerReducer(reducer, {
    visible: false,
    selectImage: '',
  });
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
        {state.visible && <ImageModal />}
      </ImageModalContext.Provider>
      {Children.map(
        children as any,
        (
          child: ReactElement<{
            'data-img': number;
            onClick: (e: MouseEvent) => void;
          }>,
        ) => {
          return cloneElement(child, {
            onClick(e: MouseEvent) {
              const target = e.currentTarget as HTMLDivElement;
              const { left, right, top, bottom, width, height } = target.getBoundingClientRect();
              const cx = (left + right - width) / 2;
              const cy = (top + bottom - height) / 2;
              const index = child?.props?.['data-img'];
              dispatch({
                type: ImageModalContextActionType.open,
                payload: {
                  selectImage: images[index].objectUrl,
                  origin: [cx, cy],
                  linkImages: [index - 1, index + 1],
                },
              });
            },
          });
        },
      )}
    </>
  );
};
