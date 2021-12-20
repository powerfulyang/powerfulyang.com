import type { FC } from 'react';
import React, { Children, cloneElement, useEffect, useMemo } from 'react';
import { useImmerReducer } from '@powerfulyang/hooks';
import dynamic from 'next/dynamic';
import type { ImageModalContextAction, ImageModalContextState } from '@/context/ImageModalContext';
import { ImageModalContext, ImageModalContextActionType } from '@/context/ImageModalContext';
import type { Asset } from '@/type/Asset';

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

export const ImagePreview: FC<{ images: Asset[]; parentControl?: boolean }> = ({
  children,
  images,
  parentControl = true,
}) => {
  const [state, dispatch] = useImmerReducer(reducer, {});
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
      <DynamicImageModal />
      {Children.map(children, (child, index) =>
        cloneElement(<div>{child}</div>, {
          onClick() {
            parentControl &&
              dispatch({
                type: ImageModalContextActionType.open,
                payload: {
                  selectIndex: index,
                },
              });
          },
        }),
      )}
    </ImageModalContext.Provider>
  );
};
